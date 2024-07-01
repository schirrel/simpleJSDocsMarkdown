import { TestElement } from "src/pageObjects/setup/TestElement";
import { TestDriver } from "../../setup/TestTool";

/**
 * Available objects on the Dialog Component
 * @export
 * @class DialogObjects
 * @typedef {DialogObjects}
 */
export class DialogObjects {
    /**
     * The primary action button
     * @readonly
     * @static
     * @type {TestElement} - the element that represents the input on the page
     */
    static get primaryButton(): TestElement {
        return TestDriver.get(".btn-primary");
    }
    /**
     * The secondary action button
     * @readonly
     * @static
     * @type {TestElement} - the element that represents the input on the page
     */
    static get secondarySubmit(): TestElement {
        return TestDriver.get(".second-primary");
    }
    /**
     * The close button
     * @readonly
     * @static
     * @type {TestElement} - the element that represents the input on the page
     */
    static get closeButton(): TestElement {
        return TestDriver.get(".close");
    }
    /**
     * The title of the dialog
     * @readonly
     * @static
     * @type {TestElement} - the element that represents the input on the page
     */
    static get title(): TestElement {
        return TestDriver.get("h1");
    }
}
