
import { Button, Input, Card } from '../../components'

export default function Home() {
  return (
      <Card>
        <h2 className="text-xl font-semibold mb-4">Teste de UI</h2>
        <Input placeholder="Digite algo…" />
        <Button className="mt-4">Enviar</Button>
      </Card>
  )
}