/** Token secreto generado en el cliente al crear un registro. */
export function generateManageToken(): string {
  const part = () => crypto.randomUUID().replace(/-/g, "");
  return `${part()}${part()}`;
}
