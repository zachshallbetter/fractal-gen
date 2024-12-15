import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import { chromium } from 'playwright';

describe('Web Interface E2E Tests', () => {
    let browser;
    let page;
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

    before(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
    });

    after(async () => {
        await browser.close();
    });

    describe('Initial Load', () => {
        it('should load the application successfully', async () => {
            await page.goto(BASE_URL);
            
            // Check title
            const title = await page.title();
            expect(title).to.include('Fractal Generator');
            
            // Check main elements
            const canvas = await page.$('canvas');
            expect(canvas).to.exist;
            
            const controls = await page.$('.controls-panel');
            expect(controls).to.exist;
        });

        it('should display available fractal types', async () => {
            const fractalSelect = await page.$('select#fractal-type');
            const options = await fractalSelect.$$('option');
            
            expect(options.length).to.be.at.least(3); // Should have multiple fractal types
            
            const optionTexts = await Promise.all(
                options.map(option => option.textContent())
            );
            expect(optionTexts).to.include.members(['Mandelbrot', 'Julia']);
        });
    });

    describe('User Interactions', () => {
        it('should handle parameter changes', async () => {
            // Change iteration count
            await page.fill('#iterations', '500');
            
            // Change color scheme
            await page.selectOption('#color-scheme', 'spectrum');
            
            // Verify canvas updates
            const updatePromise = page.waitForFunction(() => 
                window.lastRenderTime > Date.now() - 1000
            );
            await updatePromise;
            
            // Check if image data changed
            const canvas = await page.$('canvas');
            const imageData = await canvas.screenshot();
            expect(imageData).to.exist;
        });

        it('should support zoom interactions', async () => {
            const canvas = await page.$('canvas');
            
            // Perform zoom action
            const box = await canvas.boundingBox();
            await page.mouse.move(box.x + box.width/2, box.y + box.height/2);
            await page.mouse.wheel(0, -100); // Zoom in
            
            // Wait for re-render
            await page.waitForTimeout(500);
            
            // Verify zoom level changed
            const zoomLevel = await page.evaluate(() => 
                document.querySelector('#zoom-level').textContent
            );
            expect(parseFloat(zoomLevel)).to.be.above(1);
        });
    });

    describe('Real-time Updates', () => {
        it('should update preview in real-time', async () => {
            // Enable real-time preview
            await page.click('#real-time-preview');
            
            // Change parameters
            await page.fill('#iterations', '300');
            
            // Verify quick updates
            const startTime = Date.now();
            await page.waitForFunction(() => 
                window.lastRenderTime > Date.now() - 100
            );
            const duration = Date.now() - startTime;
            expect(duration).to.be.below(200);
        });

        it('should handle rapid parameter changes', async () => {
            const changes = [100, 200, 300, 400, 500];
            let lastUpdate = Date.now();
            
            for (const value of changes) {
                await page.fill('#iterations', value.toString());
                await page.waitForFunction(() => 
                    window.lastRenderTime > window.lastParameterChange
                );
                
                const currentTime = Date.now();
                const updateInterval = currentTime - lastUpdate;
                expect(updateInterval).to.be.below(100);
                lastUpdate = currentTime;
            }
        });
    });

    describe('Export and Share', () => {
        it('should export fractal as image', async () => {
            await page.click('#export-button');
            
            // Wait for download
            const downloadPromise = page.waitForEvent('download');
            await page.click('#download-png');
            const download = await downloadPromise;
            
            expect(download.suggestedFilename()).to.match(/fractal.*\.png$/);
        });

        it('should generate shareable link', async () => {
            await page.click('#share-button');
            
            const shareUrl = await page.inputValue('#share-url');
            expect(shareUrl).to.include(BASE_URL);
            expect(shareUrl).to.include('params=');
            
            // Verify link contains current parameters
            const params = new URL(shareUrl).searchParams.get('params');
            const decodedParams = JSON.parse(atob(params));
            expect(decodedParams).to.have.property('iterations');
            expect(decodedParams).to.have.property('colorScheme');
        });
    });

    describe('Error Handling', () => {
        it('should display error messages for invalid inputs', async () => {
            // Try invalid iteration count
            await page.fill('#iterations', '-1');
            
            const errorMessage = await page.textContent('.error-message');
            expect(errorMessage).to.include('must be positive');
        });

        it('should recover from rendering errors', async () => {
            // Force a rendering error
            await page.evaluate(() => {
                window.dispatchEvent(new Event('webglcontextlost'));
            });
            
            // Check error handling
            const errorDisplay = await page.textContent('.error-display');
            expect(errorDisplay).to.include('rendering error');
            
            // Verify recovery
            await page.click('#retry-render');
            const canvas = await page.$('canvas');
            expect(canvas).to.exist;
        });
    });
}); 