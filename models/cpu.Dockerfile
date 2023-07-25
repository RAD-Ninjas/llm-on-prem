

FROM pytorch/pytorch:latest
RUN pip install -U pip

RUN pip install fschat einops

# Fix a bug in fastchat
RUN pip install pydantic-settings
RUN sed -i 's/from pydantic import BaseSettings/from pydantic_settings import BaseSettings/' /opt/conda/lib/python3.10/site-packages/fastchat/serve/openai_api_server.py
RUN sed -i 's/api_keys: List\[str\] = None/api_keys: List\[str\] = []/g' /opt/conda/lib/python3.10/site-packages/fastchat/serve/openai_api_server.py
