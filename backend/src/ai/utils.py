import os
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, create_model
from typing import Any, Type, Optional

# Try to load dotenv if available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # If dotenv is not available, skip loading
    pass


def get_var_db(var_name: str) -> str:
    """
    Get environment variable value
    
    Args:
        var_name: Name of the environment variable
        
    Returns:
        Environment variable value or empty string if not found
    """
    return os.getenv(var_name, "")


def load_api_keys():
    """Load API keys from environment variables"""
    openai_key = get_var_db("OPENAI_API_KEY") or get_var_db("CHAT_GPT_API_KEY")
    serper_key = get_var_db("SERPER_API_KEY") or get_var_db("SERP_API_KEY")
    
    if openai_key:
        os.environ["OPENAI_API_KEY"] = openai_key
    if serper_key:
        os.environ["SERPER_API_KEY"] = serper_key
        
    os.environ["OPENAI_MODEL_NAME"] = os.getenv("OPENAI_MODEL_NAME", "gpt-4o")


def create_agent(
        role: str,
        goal: str,
        backstory: str,
        tools=[],
        allow_delegation: bool = True,
        verbose: bool = True,
):
    """
        role - it is 5 word max title of the agent
        goal - it is one sentence explaining the idea behind the agent
        backstory - few sentences about job description of the agent
        tools - array of tools from crew library that agent can use when it is working
        allow_delegation: - if this agent allows delegation of tasks to other agents
            by default it is true
            false - the agent can assign tasks to other agents instead of handling everything itself.
            true - the agent must complete all assigned tasks on its own.
        verbose - True or False - do we want to see the logs and trail of execution
    """

    agent_params = {
        "role": role,
        "goal": goal,
        "backstory": backstory,
        "allow_delegation": allow_delegation,
        "verbose": verbose,
    }

    if len(tools) > 0:
        agent_params["tools"] = tools

    return Agent(**agent_params)


def create_task(
        description: str,
        expected_output: str,
        agent: Agent,
        human_input: bool = False,
        output_json: dict = None,
        output_file: str = None,
        async_execution: bool = False,
        tools=[],
        markdown: bool = False,
        context=[]
):
    """
            description - few sentences about Rules of the tasks
            expected_output - few sentences about the output of the task
            agent - agent that is going to perform this task
            human_input - the task will ask for human feedback
                (whether you like the results or not) before finalising it.
            output_json - you can specify the structure of the output you want.
            output_file - path of a file where the result will be stored
            async_execution - it means the task can run in parallel with the tasks which come after it.
            tools - array of tools from crew library that task can use to be executed
    """

    task_params = {
        "description": description,
        "expected_output": expected_output,
        "human_input": human_input,
        "async_execution": async_execution,
        "agent": agent
    }

    if len(tools) > 0:
        task_params["tools"] = tools

    if output_json:
        task_params["output_json"] = output_json

    if output_file:
        task_params["output_file"] = output_file

    if markdown:
        task_params["markdown"] = markdown

    if len(context) > 0:
        task_params["context"] = context

    return Task(**task_params)


def export_to_markdown(result, filename='final_result.md'):
    with open(filename, 'w') as file:
        file.write("# Final Result\n\n")  # Add a header for the markdown file

        # If result is a dictionary, format it as key-value pairs
        if isinstance(result, dict):
            for key, value in result.items():
                file.write(f"## {key}\n")
                file.write(f"{value}\n\n")

        # If result is a list of dictionaries, format it as a table
        elif isinstance(result, list) and isinstance(result[0], dict):
            # Write the header row (keys of the first dictionary)
            keys = result[0].keys()
            file.write("| " + " | ".join(keys) + " |\n")
            file.write("|" + "----|" * len(keys) + "\n")  # Underline the header

            # Write the data rows
            for row in result:
                file.write("| " + " | ".join(str(row[key]) for key in keys) + " |\n")

        # For other types (e.g., string or list), just write the result as is
        else:
            file.write(f"{str(result)}\n")


def create_and_run_crew(
        inputs: dict = None,
        agents: [Agent] = [],
        tasks: [Task] = [],
        manager: dict = None,
        process=None,
        verbose=True,
        memory=True,
        save_results=False
):
    load_api_keys()

    """
            inputs - all the dynamic parameters that needs to be passed in the
            agents - list of agents used in the crew (order is not important)
            tasks - list of the tasks (tasks are executed in the listed order)
            manager - lets you choose the "manager" LLM you want to use.
            process - class helps to delegate the workflow to the Agents (kind of like a Manager at work)
            memory - if true enables memory for the whole crew
    """

    crew_params = {
        "agents": agents,
        "tasks": tasks,
        "verbose": verbose,
        "memory": memory
    }

    if manager:
        crew_params["manager_llm"] = ChatOpenAI(**manager)

        if process:
            if process == "hierarchical":
                process = Process.hierarchical
            elif process == 'sequential':
                process = Process.sequential

            crew_params["process"] = process

    crew = Crew(**crew_params)
    result = crew.kickoff(inputs=inputs)

    if save_results:
        export_to_markdown(
            result=result,
            filename="final_result.md"
        )

    return result


def run_crew(
        final_crew,
        inputs: dict
):
    """
            final_crew - crew to run
            inputs - all the dynamic parameters that needs to be passed in the
    """

    load_api_keys()

    result = final_crew.kickoff(
        inputs=inputs
    )


class SocialLinksModel(BaseModel):
    github: Optional[str] = None
    twitter: Optional[str] = None
    reddit: Optional[str] = None
    discord: Optional[str] = None
    telegram: Optional[str] = None
    linked_in: Optional[str] = None
    medium: Optional[str] = None
    instagram: Optional[str] = None
    youtube: Optional[str] = None
    facebook: Optional[str] = None
    whitepaper: Optional[str] = None


class ContactInfoModel(BaseModel):
    email_1: Optional[str] = None
    email_2: Optional[str] = None
    telegram: Optional[str] = None
    contact_form: Optional[str] = None
    other: Optional[str] = None  # fallback if needed


def create_dynamic_pydantic_model(class_name: str, fields: dict) -> Type[BaseModel]:
    """
    Create a dynamic Pydantic model with given class name and fields.

    :param class_name: Name of the dynamically created class.
    :param fields: Dictionary where keys are field names and values are their types.
    :return: A dynamically generated Pydantic model class.
    """
    return create_model(class_name, **{key: (field_type, ...) for key, field_type in fields.items()})