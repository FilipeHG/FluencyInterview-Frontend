import os
import PyPDF2

input_dir = 'Support-Info-Documents'
output_file = 'knowledge_base_dump.txt'

files = os.listdir(input_dir)

with open(output_file, 'w', encoding='utf-8') as out_f:
    for filename in files:
        filepath = os.path.join(input_dir, filename)
        out_f.write(f"\n\n{'='*50}\n")
        out_f.write(f"FILE: {filename}\n")
        out_f.write(f"{'='*50}\n\n")
        
        try:
            if filename.endswith('.pdf'):
                with open(filepath, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    for page in reader.pages:
                        text = page.extract_text()
                        if text:
                            out_f.write(text + "\n")
            else:
                with open(filepath, 'r', encoding='utf-8') as f:
                    out_f.write(f.read() + "\n")
        except Exception as e:
            out_f.write(f"ERROR READING FILE: {e}\n")

print('Dumped successfully.')
