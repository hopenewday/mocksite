import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[type="email"]', process.env.ADMIN_EMAIL || 'kgomez@tutamail.com');
    await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD || 'kanahola@1211');
    await page.click('button');
    await page.waitForNavigation();
    await expect(page).toHaveURL('/admin');
  });

  test('should allow taxonomy management', async ({ page }) => {
    await page.click('a[href="/admin/taxonomy"]');
    await expect(page).toHaveURL('/admin/taxonomy');

    const categoryName = `E2E Test Category ${Date.now()}`;
    await page.fill('input[placeholder="New category name"]', categoryName);
    await page.click('button:has-text("Create")');
    await expect(page.locator(`text=${categoryName}`)).toBeVisible();

    const moduleName = `E2E Test Module ${Date.now()}`;
    await page.fill('input[placeholder="New module name"]', moduleName);
    await page.click('button:has-text("Create")');
    await expect(page.locator(`text=${moduleName}`)).toBeVisible();
  });

  test('should allow test management', async ({ page }) => {
    await page.click('a[href="/admin/tests"]');
    await expect(page).toHaveURL('/admin/tests');

    const testTitle = `E2E Test ${Date.now()}`;
    await page.fill('input[placeholder="Title"]', testTitle);
    await page.fill('input[placeholder="Exam"]', 'E2E Exam');
    await page.click('button:has-text("Create Test")');
    await expect(page.locator(`text=${testTitle}`)).toBeVisible();
  });

  test('should allow question management', async ({ page }) => {
    await page.click('a[href="/admin/questions"]');
    await expect(page).toHaveURL('/admin/questions');

    // This test assumes a test has been created. In a real scenario,
    // you would create a test first and then use its ID here.
    const testId = process.env.TEST_ID || 'your-test-id'; // Replace with a valid test ID

    await page.fill('input[placeholder="Test ID"]', testId);
    await page.fill('textarea[placeholder="Content EN"]', 'E2E Question');
    await page.click('button:has-text("Create Question")');
    await expect(page.locator('text=Question created successfully!')).toBeVisible();
  });
});
