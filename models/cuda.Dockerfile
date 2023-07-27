FROM nvidia/cuda:11.8.0-devel-ubuntu22.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update -y && apt -y upgrade
RUN apt install -y software-properties-common

# Install Python 3.10 ---------------------
RUN add-apt-repository -y ppa:deadsnakes/ppa

RUN DEBIAN_FRONTEND=noninteractive apt install --yes --quiet --no-install-recommends \
  python3.10 \
  python3.10-dev \
  python3.10-distutils \
  python3.10-lib2to3 \
  python3.10-gdbm \
  python3.10-tk \
  pip

RUN pip install -U pip
RUN pip install fschat einops
RUN pip install bitsandbytes xformers einops scipy
RUN pip install pydantic==1.10.12
# RUN pip install vllm

# Fix a bug in fastchat
# RUN pip install pydantic-settings
# RUN sed -i 's/from pydantic import BaseSettings/from pydantic_settings import BaseSettings/' /usr/local/lib/python3.10/dist-packages/fastchat/serve/openai_api_server.py
# RUN sed -i 's/api_keys: List\[str\] = None/api_keys: List\[str\] = []/g' /usr/local/lib/python3.10/dist-packages/fastchat/serve/openai_api_server.py

COPY scripts/start-cuda-worker.sh start.sh