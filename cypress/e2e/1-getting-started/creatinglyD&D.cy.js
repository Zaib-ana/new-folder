// All XPaths you provided as constants
const xpDeviceSelector =
  '/html/body/div[1]/home/div/div/h-menu/div/menu-center/div/app-device-selector/div/span[1]';

const xpArtboardButton =
  '/html/body/div[2]/app-webstudio-root/div[1]/div[1]/app-drawing-panel/div/div[1]/ul/li[4]/span/div/svg';

const xpArtboardTemplateInPopup =
  '/html/body/div[2]/app-webstudio-root/div[9]/div/div/div[1]/div[2]/div/div[2]/a[1]/div/div[1]/img';

const xpChartButton =
  '/html/body/div[2]/app-webstudio-root/div[1]/div[1]/app-drawing-panel/div/div[2]/div[1]/div/div[5]/div/div';

const xpChartChoiceCanvas =
  '/html/body/div[2]/app-webstudio-root/div[1]/div[2]/div/div/div[3]/div[1]/element-factory-chart//div[1]/div[1]/div/canvas';

// ⚠️ These two are *guesses* – you’ll likely need to tweak them
// after inspecting the DOM once the artboard + chart are actually on the canvas.
const xpArtboardOnCanvas =
  '/html/body/div[2]/app-webstudio-root/div[1]/div[2]/div/div/div[3]/div[1]';

const xpChartOnCanvas =
  '/html/body/div[2]/app-webstudio-root/div[1]/div[2]/div/div/div[3]/div[1]/element-factory-chart//div[1]/div[1]/div/canvas';

describe('Design Studio - Artboard + Chart drag, center and resize', () => {
  beforeEach(() => {
    cy.viewport(1440, 900); // stable layout
    cy.visit('https://stg.platform.creatingly.com/');
  });

  it('adds artboard, adds chart, centers and resizes chart to fit artboard', () => {
    //
    // STEP 1: Click device selector (your first XPath)
    //
    cy.xpath(xpDeviceSelector, { timeout: 3000000 })
      .should('be.visible')
      .click({ force: true });

    //
    // STEP 2: Click on artboard icon (side panel)
    //
    cy.xpath(xpArtboardButton, { timeout: 3000000 })
      .should('be.visible')
      .click({ force: true });

    //
    // STEP 3: In the artboard popup, click the specific artboard template
    //
    cy.xpath(xpArtboardTemplateInPopup, { timeout: 300000 })
      .should('be.visible')
      .click({ force: true });

    // Give the app a moment to add the artboard to the canvas
    cy.wait(2000);

    //
    // STEP 4: Click on chart button in the left panel (or wherever it is)
    //
    cy.xpath(xpChartButton, { timeout: 30000 })
      .should('be.visible')
      .click({ force: true });

    //
    // STEP 5: From the available chart types, select a specific chart (canvas)
    //
    cy.xpath(xpChartChoiceCanvas, { timeout: 30000 })
      .should('be.visible')
      .click({ force: true });

    // Wait for the chart to actually appear on the artboard/canvas
    cy.wait(2000);

    //
    // Now: Artboard + Chart are added.
    // Next goal per assignment:
    //  - Move chart onto top of that artboard
    //  - Center justify it
    //  - Resize chart to fit artboard.
    //

    // Locate the artboard object on the canvas
    cy.xpath(xpArtboardOnCanvas, { timeout: 30000 })
      .should('exist')
      .and('be.visible')
      .then(($artboard) => {
        const artboardRect = $artboard[0].getBoundingClientRect();

        // Locate the chart instance on the canvas
        cy.xpath(xpChartOnCanvas, { timeout: 30000 })
          .should('exist')
          .and('be.visible')
          .then(($chart) => {
            const chartEl = $chart[0];
            const chartRect = chartEl.getBoundingClientRect();

            //
            // ---- MOVE / DRAG CHART INTO ARTBOARD & CENTER IT ----
            //

            // Starting point: center of current chart
            const startX = chartRect.x + chartRect.width / 2;
            const startY = chartRect.y + chartRect.height / 2;

            // Target: center of artboard
            const targetX = artboardRect.x + artboardRect.width / 2;
            const targetY = artboardRect.y + artboardRect.height / 2;

            // Simulate drag using mouse events
            cy.wrap($chart)
              .trigger('mousedown', {
                button: 0,
                clientX: startX,
                clientY: startY,
                force: true,
              })
              .trigger('mousemove', {
                button: 0,
                clientX: targetX,
                clientY: targetY,
                force: true,
              })
              .trigger('mouseup', { force: true });

            cy.wait(1000);

            //
            // ASSERT: chart is roughly centered on artboard
            //
            cy.xpath(xpChartOnCanvas)
              .should('be.visible')
              .then(($chartAfterMove) => {
                const movedRect = $chartAfterMove[0].getBoundingClientRect();

                const artCenterX = artboardRect.x + artboardRect.width / 2;
                const artCenterY = artboardRect.y + artboardRect.height / 2;

                const chartCenterX = movedRect.x + movedRect.width / 2;
                const chartCenterY = movedRect.y + movedRect.height / 2;

                // Allow small tolerance (5 pixels)
                expect(chartCenterX).to.be.closeTo(artCenterX, 5);
                expect(chartCenterY).to.be.closeTo(artCenterY, 5);
              });

            //
            // ---- RESIZE CHART TO FIT ARTBOARD ----
            //
            // Here we assume the chart can be resized by dragging from its
            // bottom-right area (a lot of canvas tools work this way).
            //

            // recompute after move
            const chartRectAfterMove = chartEl.getBoundingClientRect();

            const resizeStartX = chartRectAfterMove.right - 5;
            const resizeStartY = chartRectAfterMove.bottom - 5;

            const resizeTargetX = artboardRect.right - 5;
            const resizeTargetY = artboardRect.bottom - 5;

            cy.wrap($chart)
              .trigger('mousedown', {
                button: 0,
                clientX: resizeStartX,
                clientY: resizeStartY,
                force: true,
              })
              .trigger('mousemove', {
                button: 0,
                clientX: resizeTargetX,
                clientY: resizeTargetY,
                force: true,
              })
              .trigger('mouseup', { force: true });

            cy.wait(1000);

            //
            // ASSERT: chart width/height ~ artboard width/height
            //
            cy.xpath(xpChartOnCanvas)
              .should('be.visible')
              .then(($chartAfterResize) => {
                const finalRect = $chartAfterResize[0].getBoundingClientRect();

                expect(finalRect.width).to.be.closeTo(artboardRect.width, 8);
                expect(finalRect.height).to.be.closeTo(artboardRect.height, 8);
              });
          });
      });
  });
});