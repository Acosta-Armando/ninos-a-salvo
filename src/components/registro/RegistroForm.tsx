'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { EstadoCiudadSelect } from '@/components/registro/EstadoCiudadSelect'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { localDb } from '@/lib/db'
import { getDisplayName } from '@/lib/displayName'
import { parseEdadRegistro } from '@/lib/edad'
import { registroFormSchema, stripDigitsInput, stripNameInput } from '@/lib/registroSchema'
import { triggerSync } from '@/lib/sync'
import type { LocalChild } from '@/types/child'
import type { RegistroFormInput, RegistroFormValues } from '@/types/registro'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const defaultValues: RegistroFormInput = {
  estadoVital: 'ConVida',
  datosDesconocidos: false,
  fullname: '',
  edadInput: '',
  nombre_padre: '',
  nombre_madre: '',
  nombre_familiar_buscado: '',
  rasgos_particulares: '',
  estado: '',
  ciudad: '',
  estado_resguardo: '',
  detalles_ubicacion: '',
  informante_nombre: '',
  informante_telefono: ''
}

export function RegistroForm() {
  const router = useRouter()
  const online = useOnlineStatus()
  const [success, setSuccess] = useState(false)
  const [generatedId, setGeneratedId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<RegistroFormInput, unknown, RegistroFormValues>({
    resolver: zodResolver(registroFormSchema),
    defaultValues,
    mode: 'onTouched'
  })

  const estadoVital = watch('estadoVital')
  const datosDesconocidos = watch('datosDesconocidos')
  const esFallecido = estadoVital === 'Fallecido'

  const onSubmit = async (values: RegistroFormValues) => {
    setSubmitError(null)

    const edadParsed = parseEdadRegistro(values.edadInput)
    if (!edadParsed.ok) return

    try {
      const id = crypto.randomUUID()

      const record: LocalChild = {
        id,
        fullname: values.datosDesconocidos ? undefined : values.fullname.trim(),
        edad_estimada: edadParsed.edad_estimada,
        edad_anios: edadParsed.edad_anios,
        nombre_padre: values.nombre_padre || undefined,
        nombre_madre: values.nombre_madre || undefined,
        nombre_familiar_buscado: values.nombre_familiar_buscado || undefined,
        rasgos_particulares: values.rasgos_particulares,
        estado: values.estado,
        ciudad: values.ciudad,
        estado_resguardo: values.estado_resguardo,
        detalles_ubicacion: values.detalles_ubicacion,
        informante_nombre: values.informante_nombre,
        informante_telefono: values.informante_telefono,
        sync_status: 'pending',
        status: 'Buscando',
        estado_vital: values.estadoVital,
        created_at: new Date()
      }

      await localDb.children.add(record)
      setGeneratedId(id)
      setSuccess(true)

      if (online) {
        queueMicrotask(() => {
          void triggerSync()
        })
      }

      const destino = online ? (values.estadoVital === 'Fallecido' ? '/fallecidos' : '/tablero') : '/'
      setTimeout(() => router.push(destino), 2500)
    } catch {
      setSubmitError('No se pudo guardar el registro. Intenta de nuevo.')
    }
  }

  const visualId = generatedId && datosDesconocidos ? getDisplayName(null, generatedId) : null

  if (success) {
    return (
      <Card className='border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/40'>
        <CardHeader className='text-center'>
          <CardTitle className='text-green-800 dark:text-green-200'>Registro guardado localmente</CardTitle>
          {visualId && <CardDescription className='text-green-700 dark:text-green-300'>{visualId}</CardDescription>}
        </CardHeader>
        <CardContent className='text-center text-sm text-green-600 dark:text-green-400'>
          {online
            ? 'Guardado en este dispositivo. Los datos se están sincronizando con el servidor.'
            : 'Sin conexión. El registro quedó guardado en este dispositivo y se subirá al recuperar internet.'}
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6' noValidate>
      {submitError && (
        <Card className='border-destructive/50 bg-destructive/10'>
          <CardContent className='pt-4 text-sm text-destructive'>{submitError}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Condición</CardTitle>
          <CardDescription>
            Indica si el registro es para buscar reencuentro o para identificación familiar con dignidad (niño, niña o
            adolescente).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name='estadoVital'
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ConVida'>Con vida — busca reencuentro</SelectItem>
                  <SelectItem value='Fallecido'>Fallecido — identificación familiar</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </CardContent>
      </Card>

      <Card className='border-amber-200/80 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20'>
        <CardContent className='flex gap-3 text-sm leading-relaxed text-amber-950 dark:text-amber-100'>
          <Shield className='mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-300' />
          <p>
            Por protección de niños, niñas y adolescentes (LOPNNA), <strong>no se publican fotografías</strong> en esta
            plataforma. Describe con detalle los rasgos visibles; las familias podrán ubicar al niño, niña o adolescente
            y verificar identidad llamando o acudiendo al punto de resguardo.
            {esFallecido
              ? ' En registros de fallecidos, evita detalles que puedan ser dolorosos para la familia.'
              : null}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Datos de la persona registrada</CardTitle>
          <CardDescription>Información para identificar al niño, niña o adolescente.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {esFallecido ? (
            <div className='space-y-3 rounded-lg border bg-muted/30 p-4'>
              <p className='text-sm font-medium'>¿Se conocen los datos?</p>
              <Controller
                name='datosDesconocidos'
                control={control}
                render={({ field }) => (
                  <div className='flex items-start gap-3'>
                    <Checkbox
                      id='desconocidos'
                      checked={field.value}
                      onCheckedChange={(v) => {
                        const checked = v === true
                        field.onChange(checked)
                        if (checked) {
                          setValue('fullname', '')
                          void trigger('fullname')
                        }
                      }}
                    />
                    <div className='space-y-1'>
                      <Label htmlFor='desconocidos' className='cursor-pointer'>
                        No se conocen sus datos
                      </Label>
                      <p className='text-sm text-muted-foreground'>
                        Si no tienes nombre ni otros datos, marca esta opción. Se generará un ID para la identificación
                        familiar.
                      </p>
                    </div>
                  </div>
                )}
              />
            </div>
          ) : (
            <Controller
              name='datosDesconocidos'
              control={control}
              render={({ field }) => (
                <div className='flex items-start gap-3 rounded-lg border bg-muted/30 p-4'>
                  <Checkbox
                    id='desconocidos'
                    checked={field.value}
                    onCheckedChange={(v) => {
                      const checked = v === true
                      field.onChange(checked)
                      if (checked) {
                        setValue('fullname', '')
                        void trigger('fullname')
                      }
                    }}
                  />
                  <div className='space-y-1'>
                    <Label htmlFor='desconocidos' className='cursor-pointer'>
                      El niño, niña o adolescente no puede hablar / datos desconocidos
                    </Label>
                    <p className='text-sm text-muted-foreground'>Se generará un ID temporal en lugar del nombre.</p>
                  </div>
                </div>
              )}
            />
          )}

          <div className='grid gap-4 sm:grid-cols-2'>
            <FormField label='Nombre (si se conoce)' required={!datosDesconocidos} error={errors.fullname?.message}>
              <Input
                {...register('fullname', {
                  onChange: (e) => {
                    e.target.value = stripNameInput(e.target.value)
                  }
                })}
                disabled={datosDesconocidos}
                placeholder={datosDesconocidos ? 'Se generará automáticamente' : ''}
                aria-invalid={Boolean(errors.fullname)}
              />
            </FormField>

            <FormField label='Edad estimada (años)' required error={errors.edadInput?.message}>
              <div className='space-y-2'>
                <Input
                  type='text'
                  inputMode='numeric'
                  placeholder='Ej: 0, 8'
                  aria-invalid={Boolean(errors.edadInput)}
                  {...register('edadInput', {
                    onChange: (e) => {
                      e.target.value = stripDigitsInput(e.target.value)
                      void trigger('edadInput')
                    }
                  })}
                />
                <p className='text-xs text-muted-foreground'>
                  Edad en años completos. Usa 0 si tiene menos de 1 año (0–12 meses).
                </p>
              </div>
            </FormField>
          </div>

          <FormField label='Rasgos particulares' required error={errors.rasgos_particulares?.message}>
            <Textarea
              {...register('rasgos_particulares')}
              placeholder='Ej: Ropa, altura, color de ojos, señas particulares...'
              rows={4}
              aria-invalid={Boolean(errors.rasgos_particulares)}
            />
            <p className='text-xs text-muted-foreground'>
              Incluye ropa, complexión, cabello, señas visibles y cualquier detalle que ayude a la familia a reconocer
              al niño, niña o adolescente sin necesidad de fotos.
            </p>
          </FormField>

          <div className='grid gap-4 sm:grid-cols-2'>
            <FormField label='Nombre del padre' error={errors.nombre_padre?.message}>
              <Input
                {...register('nombre_padre', {
                  onChange: (e) => {
                    e.target.value = stripNameInput(e.target.value)
                  }
                })}
                aria-invalid={Boolean(errors.nombre_padre)}
              />
            </FormField>
            <FormField label='Nombre de la madre' error={errors.nombre_madre?.message}>
              <Input
                {...register('nombre_madre', {
                  onChange: (e) => {
                    e.target.value = stripNameInput(e.target.value)
                  }
                })}
                aria-invalid={Boolean(errors.nombre_madre)}
              />
            </FormField>
          </div>

          <FormField label='Familiar que busca' error={errors.nombre_familiar_buscado?.message}>
            <Input
              {...register('nombre_familiar_buscado', {
                onChange: (e) => {
                  e.target.value = stripNameInput(e.target.value)
                }
              })}
              aria-invalid={Boolean(errors.nombre_familiar_buscado)}
            />
          </FormField>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Ubicación y resguardo</CardTitle>
          <CardDescription>Dónde está el niño, niña o adolescente y cómo llegar al punto de resguardo.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <EstadoCiudadSelect
            estado={watch('estado')}
            ciudad={watch('ciudad')}
            onEstadoChange={(v) => {
              setValue('estado', v, { shouldValidate: true })
            }}
            onCiudadChange={(v) => {
              setValue('ciudad', v, { shouldValidate: true })
            }}
            required
            estadoLabel='Estado'
            ciudadLabel='Municipio'
          />
          {(errors.estado || errors.ciudad) && (
            <p className='text-xs text-destructive'>{errors.estado?.message ?? errors.ciudad?.message}</p>
          )}

          <FormField label='Nombre del punto de resguardo' required error={errors.estado_resguardo?.message}>
            <Textarea
              {...register('estado_resguardo')}
              placeholder='Ej: Albergue San José, Escuela Bolívar'
              rows={3}
              aria-invalid={Boolean(errors.estado_resguardo)}
            />
          </FormField>

          <FormField label='Descripción del sitio' required error={errors.detalles_ubicacion?.message}>
            <Textarea
              {...register('detalles_ubicacion')}
              placeholder='Piso, sala, referencia visible: carpas azules, entrada norte...'
              rows={3}
              aria-invalid={Boolean(errors.detalles_ubicacion)}
            />
          </FormField>

          <Separator />

          <div className='grid gap-4 sm:grid-cols-2'>
            <FormField label='Tu nombre (informante)' required error={errors.informante_nombre?.message}>
              <Input
                {...register('informante_nombre', {
                  onChange: (e) => {
                    e.target.value = stripNameInput(e.target.value)
                  }
                })}
                aria-invalid={Boolean(errors.informante_nombre)}
              />
            </FormField>
            <FormField label='Tu teléfono' required error={errors.informante_telefono?.message}>
              <Input
                type='tel'
                inputMode='tel'
                placeholder='04141234567'
                {...register('informante_telefono')}
                aria-invalid={Boolean(errors.informante_telefono)}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Button type='submit' size='lg' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className='size-4 animate-spin' />
            Guardando...
          </>
        ) : (
          'Registrar'
        )}
      </Button>
    </form>
  )
}

function FormField({
  label,
  required,
  error,
  children
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className='space-y-2'>
      <Label>
        {label}
        {required ? ' *' : ''}
      </Label>
      {children}
      {error ? <p className='text-xs text-destructive'>{error}</p> : null}
    </div>
  )
}
