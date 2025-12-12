# Quick Start: Test Management Guide

## 🚀 5-Minute Setup

### Step 1: Access Admin Panel

```
URL: http://localhost:5173/admin/login
```

### Step 2: Create Your First Test

1. Go to `/admin/tests`
2. Click "Create New Test"
3. Fill in:
   - **Title**: "Sample Mock Test"
   - **Exam**: "General Knowledge"
   - **Difficulty**: "easy"
   - **Duration**: 30 minutes
   - **Language**: "en"
4. **Copy the Test ID** (you'll need this!)

### Step 3: Add Questions (Choose One Method)

#### Method A: Manual Entry (Good for 1-10 questions)

1. Go to `/admin/questions`
2. Paste your Test ID
3. Fill in question details
4. Click "Create"
5. Repeat for each question

#### Method B: CSV Upload (Good for 10+ questions)

1. Create a CSV file:

```csv
test_id,type,content_en,options,correct_answer,topic,explanation_en
YOUR-TEST-ID-HERE,mcq,"What is 2+2?","2,3,4,5",2,Math,"2+2 equals 4"
YOUR-TEST-ID-HERE,mcq,"Capital of France?","London,Paris,Berlin,Rome",1,Geography,"Paris is the capital"
```

2. Go to `/admin/upload`
3. Select your CSV file
4. Click "Upload"

### Step 4: Test It!

1. Go to `/tests`
2. Find your test
3. Click "Start Test"
4. Answer questions
5. View results

---

## 📝 CSV Template

### Basic Template

```csv
test_id,type,content_en,options,correct_answer,topic,explanation_en
```

### Full Template (with Hindi)

```csv
test_id,type,content_en,content_hi,options,correct_answer,topic,section,explanation_en,explanation_hi
```

### Example: SSC CGL Mock Test

```csv
test_id,type,content_en,options,correct_answer,topic,explanation_en
550e8400-e29b-41d4-a716-446655440000,mcq,"Who is the current Prime Minister of India?","Narendra Modi,Rahul Gandhi,Amit Shah,Yogi Adityanath",0,Current Affairs,"Narendra Modi is the current PM"
550e8400-e29b-41d4-a716-446655440000,mcq,"What is the capital of Karnataka?","Mumbai,Bangalore,Chennai,Hyderabad",1,Geography,"Bangalore is the capital of Karnataka"
550e8400-e29b-41d4-a716-446655440000,mcq,"Solve: 15 + 25 = ?","30,35,40,45",2,Mathematics,"15 + 25 = 40"
```

---

## 🎯 Question Types

### 1. Multiple Choice (MCQ)

```csv
test_id,type,content_en,options,correct_answer
YOUR-ID,mcq,"What is 2+2?","2,3,4,5",2
```

**Note**: `correct_answer` is the index (0 = first option, 1 = second, etc.)

### 2. True/False

```csv
test_id,type,content_en,options,correct_answer
YOUR-ID,tf,"The Earth is flat","True,False",1
```

### 3. Fill in the Blank

```csv
test_id,type,content_en,options,correct_answer
YOUR-ID,fib,"The capital of India is ___","Delhi,Mumbai,Kolkata,Chennai",0
```

### 4. Matching

```csv
test_id,type,content_en,options,correct_answer
YOUR-ID,match,"Match: India - ?","Delhi,Washington,London,Paris",0
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "Test ID not found"
**Solution**: Make sure you created the test first and copied the correct UUID.

### Issue 2: CSV upload fails
**Solution**:
- Check CSV format matches template exactly
- Ensure no extra commas in content
- Use quotes around text with commas: `"Option A, with comma"`

### Issue 3: Questions not showing
**Solution**:
- Verify test_id matches exactly
- Check that test is published
- Clear browser cache

### Issue 4: Wrong answer marked correct
**Solution**:
- Remember: `correct_answer` starts at 0
- First option = 0, Second = 1, Third = 2, Fourth = 3

---

## 📊 Database Structure Quick Reference

```
tests
├── id (UUID) - Auto-generated
├── title (text) - "SSC CGL Mock Test 1"
├── exam (text) - "SSC CGL"
├── difficulty (text) - "easy" | "medium" | "hard"
├── duration_minutes (int) - 60
├── language (text) - "en" | "hi"
└── created_at (timestamp) - Auto-generated

questions
├── id (UUID) - Auto-generated
├── test_id (UUID) - Links to tests.id
├── type (text) - "mcq" | "tf" | "fib" | "match"
├── content_en (jsonb) - {"text": "Question?"}
├── content_hi (jsonb) - {"text": "प्रश्न?"}
├── options (jsonb) - ["A", "B", "C", "D"]
├── correct_answer (int) - 0, 1, 2, or 3
├── topic (text) - "Mathematics"
├── section (text) - "Algebra"
├── explanation_en (text) - "Explanation..."
├── explanation_hi (text) - "व्याख्या..."
└── created_at (timestamp) - Auto-generated
```

---

## 🎓 Sample Test Templates

### Template 1: General Knowledge (10 Questions)

```csv
test_id,type,content_en,options,correct_answer,topic
YOUR-ID,mcq,"Who wrote the Indian National Anthem?","Rabindranath Tagore,Bankim Chandra,Sarojini Naidu,Mahatma Gandhi",0,History
YOUR-ID,mcq,"Largest planet in solar system?","Earth,Jupiter,Saturn,Mars",1,Science
YOUR-ID,mcq,"Capital of Australia?","Sydney,Melbourne,Canberra,Perth",2,Geography
YOUR-ID,mcq,"Speed of light?","300000 km/s,150000 km/s,450000 km/s,600000 km/s",0,Physics
YOUR-ID,mcq,"Father of Computer?","Bill Gates,Steve Jobs,Charles Babbage,Alan Turing",2,Technology
YOUR-ID,mcq,"Smallest state in India?","Goa,Sikkim,Tripura,Manipur",0,Geography
YOUR-ID,mcq,"National bird of India?","Peacock,Parrot,Eagle,Sparrow",0,General
YOUR-ID,mcq,"First President of India?","Rajendra Prasad,Sarvepalli Radhakrishnan,Zakir Hussain,APJ Abdul Kalam",0,History
YOUR-ID,mcq,"Largest ocean?","Atlantic,Indian,Arctic,Pacific",3,Geography
YOUR-ID,mcq,"Currency of Japan?","Yuan,Yen,Won,Ringgit",1,Economics
```

### Template 2: Mathematics (10 Questions)

```csv
test_id,type,content_en,options,correct_answer,topic
YOUR-ID,mcq,"15 + 25 = ?","30,35,40,45",2,Arithmetic
YOUR-ID,mcq,"12 × 8 = ?","84,96,108,120",1,Multiplication
YOUR-ID,mcq,"Square root of 144?","10,11,12,13",2,Algebra
YOUR-ID,mcq,"50% of 200?","50,75,100,125",2,Percentage
YOUR-ID,mcq,"Area of circle (r=7)?","154,308,462,616",0,Geometry
YOUR-ID,mcq,"Prime number?","15,17,21,25",1,Number Theory
YOUR-ID,mcq,"LCM of 12 and 18?","36,48,54,72",0,Number Theory
YOUR-ID,mcq,"Value of π?","3.14,2.71,1.41,1.73",0,Constants
YOUR-ID,mcq,"Solve: 2x = 10","x=3,x=4,x=5,x=6",2,Algebra
YOUR-ID,mcq,"Perimeter of square (side=5)?","15,20,25,30",1,Geometry
```

---

## 🚀 Advanced: Bulk Operations

### Create 100 Questions at Once

1. Use Excel/Google Sheets to generate questions
2. Export as CSV
3. Upload via `/admin/upload`
4. Verify count matches

### Update Existing Questions

Currently not supported via UI. Use Supabase SQL:

```sql
UPDATE questions
SET content_en = '{"text": "Updated question?"}'
WHERE id = 'question-uuid-here';
```

### Delete Test and All Questions

```sql
DELETE FROM tests WHERE id = 'test-uuid-here';
-- Questions auto-delete due to CASCADE
```

---

## 📱 Mobile Testing

1. Open on mobile browser
2. Test responsive layout
3. Verify touch interactions
4. Check timer functionality
5. Test result submission

---

## 🔐 Security Best Practices

1. **Never share admin credentials**
2. **Use strong passwords**
3. **Enable Cloudflare firewall**
4. **Restrict admin panel to specific IPs** (optional)
5. **Regular backups of Supabase data**

---

## 📈 Analytics & Monitoring

### Track Test Performance

```sql
-- Most popular tests
SELECT t.title, COUNT(ua.id) as attempts
FROM tests t
LEFT JOIN user_attempts ua ON t.id = ua.test_id
GROUP BY t.id
ORDER BY attempts DESC;

-- Average scores
SELECT t.title, AVG(ua.score) as avg_score
FROM tests t
LEFT JOIN user_attempts ua ON t.id = ua.test_id
GROUP BY t.id;

-- Completion rate
SELECT
  t.title,
  COUNT(ua.id) as total_attempts,
  COUNT(ua.completed_at) as completed,
  (COUNT(ua.completed_at)::float / COUNT(ua.id) * 100) as completion_rate
FROM tests t
LEFT JOIN user_attempts ua ON t.id = ua.test_id
GROUP BY t.id;
```

---

## 🆘 Support

### Need Help?

1. Check DEPLOYMENT_AND_SEO_GUIDE.md
2. Check Supabase documentation
3. Review schema.sql for database structure
4. Check browser console for errors

### Common SQL Queries

```sql
-- List all tests
SELECT * FROM tests ORDER BY created_at DESC;

-- Count questions per test
SELECT test_id, COUNT(*) as question_count
FROM questions
GROUP BY test_id;

-- Find test by title
SELECT * FROM tests WHERE title ILIKE '%mock%';

-- Get all questions for a test
SELECT * FROM questions WHERE test_id = 'your-test-id';
```

---

## ✅ Checklist: Before Going Live

- [ ] Created at least 5 tests
- [ ] Each test has 20+ questions
- [ ] Tested on desktop browser
- [ ] Tested on mobile browser
- [ ] Verified timer works correctly
- [ ] Verified scoring is accurate
- [ ] Checked results page displays correctly
- [ ] Set up Supabase backups
- [ ] Configured Cloudflare
- [ ] Updated sitemap.xml
- [ ] Submitted to Google Search Console

---

## 🎉 You're Ready!

Your mock test platform is now ready to use. Start creating tests and sharing with users!

**Next Steps:**
1. Create 10-20 quality tests
2. Implement SEO enhancements (see SEO_AND_CLOUDFLARE_IMPLEMENTATION_PLAN.md)
3. Deploy to production
4. Market your platform
5. Monitor analytics
6. Iterate based on user feedback
