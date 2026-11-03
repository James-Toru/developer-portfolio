"""Publish an owner-approved original PDF without reauthoring its contents."""
import argparse
from pathlib import Path
import shutil


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Path to the approved original CV PDF")
    args = parser.parse_args()
    source = args.source.resolve(strict=True)
    destination = Path(__file__).resolve().parents[1] / "public/james-gatoru-cv.pdf"
    if source == destination:
        parser.error("Choose the original source PDF, not the published destination.")
    with source.open("rb") as document:
        if document.read(5) != b"%PDF-":
            parser.error("The source must be a PDF document.")
    shutil.copyfile(source, destination)
    print(f"Published the original PDF unchanged: {destination}")


if __name__ == "__main__":
    main()
