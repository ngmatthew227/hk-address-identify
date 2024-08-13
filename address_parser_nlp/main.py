import spacy
import argparse
import os
import pathlib
from spacy import displacy
import re


def determine_lang(address):
    if re.search(r"[\u4e00-\u9fff]", address):
        return "chi"
    return "en"

def get_current_path(file_path):
    # get the script running path
    current_path = pathlib.Path(__file__).parent.absolute()
    if os.path.exists(f"{current_path}/_internal/{file_path}"):
        print(f"File found at _internal folder")
        return f"{current_path}/_internal/{file_path}"
    return f"{current_path}/{file_path}"


def parse_arguments():
    parser = argparse.ArgumentParser(description="Annotate address")
    parser.add_argument("-address", type=str, help="Address to annotate", nargs="+", required=True)
    return parser.parse_args()


def load_model(lang):
    model_path = f"models/{lang}_models/model-last"
    model_path = get_current_path(model_path)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model not found at {model_path}")
    return spacy.load(model_path)


def load_entity_ruler(nlp, name, lang):
    pattern_path = f"pattern/{lang}_{name}_name_pattern.jsonl"
    pattern_path = get_current_path(pattern_path)
    if not os.path.exists(pattern_path):
        raise FileNotFoundError(f"Pattern not found at {pattern_path}")
    ruler = nlp.add_pipe("entity_ruler", name=f"{name}_ruler", before="ner", config={"overwrite_ents": True})
    ruler.from_disk(pattern_path)
    return ruler


def main():
    args = parse_arguments()
    lang = args.lang

    nlp = load_model(lang)
    load_entity_ruler(nlp, "district", lang)
    load_entity_ruler(nlp, "street", lang)
    load_entity_ruler(nlp, "building", lang)
    print(f"Model loaded successfully with pipeline: {nlp.pipe_names}")

    for address in args.address:
        doc = nlp(address)
        predicted_entities = {ent.label_: ent.text for ent in doc.ents}
        print(f"For address: {address}, predicted entities: {predicted_entities}")


def export_svg():
    args = parse_arguments()
    chi_nlp = load_model("chi")
    en_nlp = load_model("en")
    load_entity_ruler(chi_nlp, "district", "chi")
    load_entity_ruler(en_nlp, "district", "en")
    load_entity_ruler(chi_nlp, "street", "chi")
    load_entity_ruler(en_nlp, "street", "en")
    load_entity_ruler(chi_nlp, "building", "chi")
    load_entity_ruler(en_nlp, "building", "en")

    return_svgs = []

    for address in args.address:
        if determine_lang(address) == "en":
            doc = en_nlp(address)
        else:
            doc = chi_nlp(address)
        svg = displacy.render(
            doc,
            style="ent",
            jupyter=False,
            options={
                "colors": {
                    "DISTRICT": "#FFA07A",
                    "STREET": "#90EE90",
                    "STREET_NO": "#90EE90",
                    "ESTATE_BUILDING": "#87CEFA",
                    "REAL_BUILDING": "#FFD700",
                }
            },
        )
        # join the svg into 1 line 
        svg = "".join(svg.split("\n"))
        return_svgs.append(svg)
    print("@@".join(return_svgs))

export_svg()
