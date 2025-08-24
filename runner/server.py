import http.server
import socketserver
import json
import os
import subprocess
import base64

class CodeExecutionHandler(http.server.BaseHTTPRequestHandler):
    EXECUTE_SCRIPT = '/app/runner/execute.sh' # Use the correct absolute path
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

                # Save the code to a temporary file
                with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix=f'.{language}') as tmp_file:
                    tmp_file.write(decoded_code)
                    tmp_filepath = tmp_file.name

                try:
                    # Execute the script
                    result = subprocess.run(
                        [self.EXECUTE_SCRIPT, language, tmp_filepath],
                        capture_output=True,
                        text=True,
                        timeout=30 # Add a timeout for safety
                    )

                    # Extract execution time from stderr using regex
                    # The execute.sh script outputs time in the format "real 0m0.000s" to stderr
                    time_match = re.search(r'real\s+(\d+m[\d\.]*s)', result.stderr)
                    execution_time = time_match.group(1) if time_match else 'N/A'

                    # Separate stdout and stderr
                    stdout = result.stdout
                    stderr = result.stderr.split(execution_time, 1)[0].strip() if execution_time != 'N/A' else result.stderr.strip()

                finally:
                    # Clean up the temporary file
                    os.remove(tmp_filepath)

                # Prepare the JSON response
                response_payload = {
                    'stdout': stdout,
                    'stderr': stderr,
                    'time': execution_time
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