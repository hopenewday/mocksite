# Quick Start: Test Management and Bulk Question Upload

This guide provides instructions on how to add and manage tests, with a focus on bulk uploading questions using a CSV file. Following these steps will help you efficiently populate your tests with a wide variety of questions in both English and Hindi.

## CSV File Structure for Bulk Uploads

To bulk upload questions, you will need to create a CSV file with a specific structure. The file must contain the following columns in the exact order listed below. Please see the `sample.csv` file for a practical example.

### Column Breakdown

| Column           | Type    | Required | Description                                                                                                                              | Example                                          |
| ---------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `test_id`        | string  | Yes      | The unique identifier for the test to which the question belongs. This must match an existing test ID in the database.                    | `ssc-cgl-tier1-mock1`                            |
| `type`           | enum    | No       | The type of question. Can be `mcq` (Multiple Choice), `tf` (True/False), `fib` (Fill in the Blanks), or `match` (Matching). Defaults to `mcq`. | `mcq`                                            |
| `content_en`     | string  | Yes      | The content of the question in English.                                                                                                  | "What is the capital of India?"                  |
| `content_hi`     | string  | No       | The content of the question in Hindi.                                                                                                    | "भारत की राजधानी क्या है?"                      |
| `options`        | string  | Yes      | A comma-separated list of options for the question. For `tf` questions, this should be "True, False". For `fib`, it is the answer.         | "New Delhi, Mumbai, Kolkata, Chennai"            |
| `correct_answer` | integer | Yes      | The index of the correct answer in the `options` list. The first option is index `0`, the second is `1`, and so on.                        | `0`                                              |
| `topic`          | string  | No       | The topic of the question (e.g., "Geography", "Algebra").                                                                                | "Geography"                                      |
| `section`        | string  | No       | The section of the test where the question belongs (e.g., "General Knowledge", "Quantitative Aptitude").                                  | "General Knowledge"                              |
| `explanation_en` | string  | No       | An explanation for the correct answer in English.                                                                                        | "New Delhi is the capital of India."             |
| `explanation_hi` | string  | No       | An explanation for the correct answer in Hindi.                                                                                          | "नई दिल्ली भारत की राजधानी है।"                  |

### Formatting for Different Question Types

- **Multiple Choice (`mcq`):**
  - `options`: Provide a comma-separated list of choices.
  - `correct_answer`: The index of the correct option.

- **True/False (`tf`):**
  - `options`: Should always be "True, False".
  - `correct_answer`: `0` for True, `1` for False.

- **Fill in the Blanks (`fib`):**
  - `options`: The single correct answer that fills the blank.
  - `correct_answer`: Should always be `0`.

- **Matching (`match`):**
  - *This question type is not yet fully supported in the CSV upload feature.*

### Important Notes

- Ensure your CSV file is UTF-8 encoded, especially if you are including content in Hindi or other non-English languages.
- All columns must be present, even if they are empty for a particular row.
- The `test_id` must correspond to a test that has already been created in the admin dashboard.

By following this structure, you can easily add a large number of questions to your tests at once, streamlining the content creation process.
