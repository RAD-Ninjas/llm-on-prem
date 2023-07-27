import os

import dotenv
from huggingface_hub._login import _login

dotenv.load_dotenv("../../.env")
token = os.getenv('HF_TOKEN',"")
_login(token=token, add_to_git_credential=False)
