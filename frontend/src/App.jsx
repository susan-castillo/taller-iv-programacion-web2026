import { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
  Spinner
} from 'reactstrap';

function ApiHealth({ health, loading, error }) {
  return (
    <section className="health-section" aria-labelledby="health-title">
      <div className="health-icon" aria-hidden="true">↗</div>
      <div className="health-copy">
        <h4 id="health-title">Estado de la API</h4>
        {loading ? (
          <p className="mb-0">Consultando el estado del servicio...</p>
        ) : error ? (
          <p className="mb-0" role="alert">{error}</p>
        ) : (
          <p className="mb-0">{health?.message ?? 'No se recibió una respuesta válida.'}</p>
        )}
      </div>
      <div className="health-status">
        {loading ? (
          <Spinner size="sm" aria-label="Cargando" />
        ) : (
          <Badge color={health?.status === 'ok' && !error ? 'success' : 'danger'} pill>
            {health?.status === 'ok' && !error ? 'En línea' : 'Sin conexión'}
          </Badge>
        )}
      </div>
    </section>
  );
}

function MemberCard({ member }) {
  return (
    <Card className="member-card h-100">
      <CardBody>
        <div className="member-card-heading">
          <div className="member-avatar" aria-hidden="true">
            {member.nombre?.charAt(0) || '?'}
          </div>
          <Badge color="light" className="member-tag">Integrante</Badge>
        </div>
        <CardTitle tag="h3" className="member-name">{member.nombre}</CardTitle>
        <CardText className="member-career">{member.carrera}</CardText>
        <div className="member-details">
          <div>
            <span className="detail-label">Edad</span>
            <span className="detail-value">{member.edad ?? 'Por completar'}</span>
          </div>
          <div>
            <span className="detail-label">Materias aprobadas</span>
            <span className="detail-value">{member.materiasAprobadas ?? 'Por completar'}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default function App() {
  const [health, setHealth] = useState(null);
  const [members, setMembers] = useState([]);
  const [healthLoading, setHealthLoading] = useState(true);
  const [infoLoading, setInfoLoading] = useState(true);
  const [healthError, setHealthError] = useState('');
  const [infoError, setInfoError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadEndpoint(path, onSuccess, onError) {
      try {
        const response = await fetch(path, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`El servidor respondió con el estado ${response.status}.`);
        }
        onSuccess(await response.json());
      } catch (error) {
        if (error.name !== 'AbortError') {
          onError(error.message || 'No fue posible conectar con la API.');
        }
      }
    }

    loadEndpoint('/api/health', setHealth, setHealthError)
      .finally(() => setHealthLoading(false));
    loadEndpoint('/api/info', (data) => setMembers(data.integrantes), setInfoError)
      .finally(() => setInfoLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <main className="app-shell">
      <Container className="page-container">
        <header className="page-header">
          <div className="brand-mark" aria-hidden="true">T4</div>
          <div>
            <p className="eyebrow">Programación web</p>
            <h1>Taller IV</h1>
          </div>
          <Badge color="light" className="api-label">React + Express</Badge>
        </header>

        <ApiHealth health={health} loading={healthLoading} error={healthError} />

        <section className="team-section" aria-labelledby="team-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Nuestro equipo</p>
              <h2 id="team-title">Integrantes</h2>
            </div>
            <span className="section-caption">Información proporcionada por la API</span>
          </div>

          {infoLoading ? (
            <div className="loading-state">
              <Spinner color="primary" />
              <span>Cargando información...</span>
            </div>
          ) : infoError ? (
            <Alert color="danger" className="api-error" role="alert">
              No se pudo cargar la información de los integrantes: {infoError}
            </Alert>
          ) : members.length === 0 ? (
            <Alert color="info" className="api-error">
              La API está disponible, pero todavía no hay integrantes registrados.
            </Alert>
          ) : (
            <Row className="g-4">
              {members.map((member) => (
                <Col key={member.id} xs="12" sm="6" lg="4">
                  <MemberCard member={member} />
                </Col>
              ))}
            </Row>
          )}
        </section>

        <footer className="page-footer">Taller IV <span>·</span> Frontend conectado a API REST</footer>
      </Container>
    </main>
  );
}
