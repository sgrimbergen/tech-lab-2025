# Setting Things Up

We recommend using Ubuntu or similar Linux Operating Systems. 
Install your favorite IDE, we've used VS Code to build this workshop. In Combination with WSL2 in Windows it also works fine.

Before starting you need to install the following: Node.js (>= 20.0.0), npm, and Python >= 3.11.
You can ask ChatGPT how to do this for your system or follow this short guide.

We recommend using [Volta](https://docs.volta.sh/guide/getting-started) for handling Node and npm versions. You can then install Node with version 20 with `volta install node@20`. It will also install the related npm version. After installing Node and npm, run `npm install` to install the packages.

For Python we recommend using [uv](https://github.com/astral-sh/uv?tab=readme-ov-file#installation). With which you can create a Python environment with `uv venv --python 3.12 --seed`. This automatically downloads and installs the specified Python version if it doesn't exist on your machine. `--seed` initializes the Python environment to contain pip so that the IDE can install packages via that integration.

When running the notebooks you can choose the python environment in the upper right corner. You will also need ipykernel and the Jupyter extension, but your IDE should ask for this when you have the notebooks open.