# Deployment Steps for Python Services (adcs-inference)

## Prerequisites

- Ensure **git** is installed on your system.
- You need **sudo** privileges to manage systemd services.
- The **adcs-inference** service should already be set up in systemd.
- Verify any required environment variables are configured.

## Steps

1. **Navigate to the code directory:**

   ```bash
   cd /opt/adcs/ADCS-core
   ```

2. **Pull the latest code from GitHub:**

   ```bash
   git pull
   ```

3. **Restart the service to apply changes:**

   ```bash
   sudo systemctl restart adcs-inference.service
   ```

4. **Check the service status to ensure it's running:**

   ```bash
   sudo systemctl status adcs-inference.service
   ```

## Systemd Service Configuration

The **adcs-inference** service is set up in systemd with the following configuration:

```ini
/etc/systemd/system/adcs-inference.service

[Unit]
Description=ADCS Inference Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/adcs/ADCS-core/inference
ExecStart=/bin/bash /opt/adcs/ADCS-core/inference/start_app.sh
Restart=on-failure
Environment=FLASK_APP=app.py
Environment=FLASK_ENV=production
EnvironmentFile=/opt/adcs/ADCS-core/inference/.env

[Install]
WantedBy=multi-user.target
```

## Start Script

The `start_app.sh` script is used to start the Flask application:

```bash
#!/bin/bash
# Activate the virtual environment
source /opt/adcs/ADCS-core/inference/venv/bin/activate
# Install the dependencies
pip install -r /opt/adcs/ADCS-core/inference/requirements.txt
# Run the Flask application
exec python3 -m flask run --host=0.0.0.0 --port=3003
```

### Notes

- Ensure the virtual environment is correctly set up at `/opt/adcs/ADCS-core/inference/venv`.
- The Flask application is configured to run on port 3003 and is accessible from any host (`0.0.0.0`).