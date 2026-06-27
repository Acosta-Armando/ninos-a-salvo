-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "fullname" TEXT,
    "edad_estimada" TEXT NOT NULL,
    "nombre_padre" TEXT,
    "nombre_madre" TEXT,
    "nombre_familiar_buscado" TEXT,
    "rasgos_particulares" TEXT,
    "estado_resguardo" TEXT NOT NULL,
    "detalles_ubicacion" TEXT NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "foto_url" TEXT,
    "informante_nombre" TEXT NOT NULL,
    "informante_telefono" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Buscando',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retiro_cedula" TEXT,
    "retiro_fullname" TEXT,
    "retiro_parentesco" TEXT,
    "retiro_telefono" TEXT,
    "retiro_foto_url" TEXT,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Child_status_idx" ON "Child"("status");

-- CreateIndex
CREATE INDEX "Child_created_at_idx" ON "Child"("created_at");
