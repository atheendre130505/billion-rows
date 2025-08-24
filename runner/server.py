import http.server
import socketserver
import json
import os
import subprocess
import base64

class CodeExecutionHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                payload = json.loads(post_data)

                language = payload.get('language')
                encoded_code = payload.get('code')

                if not language or not encoded_code:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'Missing language or code'}).encode('utf-8'))
                    return

                # Decode the base64 code
                decoded_code = base64.b64decode(encoded_code).decode('utf-8')

                # Execute the script
                result = subprocess.run(
                    ['/usr/local/bin/execute', language],
                    input=decoded_code,
                    capture_output=True,
                    text=True,
                    timeout=30 # Add a timeout for safety
                )

                # Prepare the JSON response
                response_payload = {
                    'stdout': result.stdout,
                    'stderr': result.stderr
                }

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(response_payload).encode('utf-8'))

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_error(404, "Not Found")

    def do_GET(self):
        self.send_error(404, "Not Found")

if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 8080))
    Handler = CodeExecutionHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT}")
        httpd.serve_forever()