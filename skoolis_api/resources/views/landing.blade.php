<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Skoolis</title>
    <style>
        :root { color-scheme: light dark; }
        body {
            font-family: system-ui, Segoe UI, Roboto, sans-serif;
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f6f7f9;
            color: #1a1a1a;
        }
        @media (prefers-color-scheme: dark) {
            body { background: #121417; color: #e8eaed; }
            .card { background: #1e2126; border-color: #2d3239; }
            code { background: #2d3239; }
            a { color: #8ab4f8; }
        }
        .card {
            max-width: 32rem;
            padding: 2rem;
            background: #fff;
            border-radius: 12px;
            border: 1px solid #e2e5eb;
            box-shadow: 0 4px 24px rgba(0,0,0,.06);
        }
        h1 { font-size: 1.5rem; margin: 0 0 0.5rem; }
        p { line-height: 1.55; margin: 0 0 1rem; }
        code {
            font-size: 0.85em;
            padding: 0.15em 0.4em;
            border-radius: 4px;
            background: #eef0f4;
        }
        ul { margin: 0; padding-left: 1.2rem; }
        li { margin: 0.35rem 0; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Skoolis</h1>
        <p>
            Vous êtes sur le <strong>serveur API</strong> Laravel. La page vitrine et l’application
            seront dans le projet <code>skoolis_web</code> (ou un autre front qui consomme l’API).
        </p>
        <p>Endpoints utiles :</p>
        <ul>
            <li><a href="{{ url('/api/v1/health') }}"><code>/api/v1/health</code></a> — état du service</li>
        </ul>
    </div>
</body>
</html>
