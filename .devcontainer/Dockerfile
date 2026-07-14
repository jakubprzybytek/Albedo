FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install AWS CLI v2
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl unzip less groff ca-certificates \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip" \
    && unzip /tmp/awscliv2.zip -d /tmp \
    && /tmp/aws/install \
    && rm -rf /var/lib/apt/lists/* /tmp/aws /tmp/awscliv2.zip

# Verify installation
RUN aws --version
