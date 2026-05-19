import PyPDF2
import sys

def extract_text(pdf_path, output_path):
    try:
        with open(pdf_path, 'rb') as f_in:
            reader = PyPDF2.PdfReader(f_in)
            text = ''
            for page in reader.pages:
                text += page.extract_text() + '\n'
        
        with open(output_path, 'w', encoding='utf-8') as f_out:
            f_out.write(text)
        print(f"Successfully extracted {len(text)} characters.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    pdf_file = "Support-Info-Documents/6.2-Tecnologias-E-Suas-Diferencas-Respostas-Completas.pdf"
    out_file = "pdf_dump_6_2.txt"
    extract_text(pdf_file, out_file)
