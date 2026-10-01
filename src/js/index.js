class Element {
    element;
    constructor(type, payload) {
        this.element = document.createElement(type);
        if (payload) {
            this.edit(payload);
        }
        return this;
    }
    edit(payload) {
        const filtered = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
        Object.assign(this.element, filtered);
        return this;
    }
    delete() {
        this.element.remove();
        return this;
    }
}
class Calculator {
    OutputField;
    translation;
    constructor() {
        this.#translate();
        this.#build();
        this.#restoreSeason();
    }
    #translate = () => {
        const language = navigator.language.split("-")[0];
        switch (language) {
            case "de":
                document.title = "Taschenrechner";
                this.translation = ["Fehler bei Eingabe!!!", ","];
                break;
            default:
                document.title = "Calculator";
                this.translation = ["Error in Input!!!", "."];
        }
    };
    #build = () => {
        const Head = document.head;
        const Body = document.body;
        const Icon = new Element("link", { id: "Icon", rel: "icon" }).element;
        const Main = new Element("main", { id: "App" }).element;
        const ColorChanger = new Element("input", { id: "ColorChanger", type: "color" }).element;
        const OutputSection = new Element("section", { id: "OutputSection" }).element;
        const InputSection = new Element("section", { id: "InputSection" }).element;
        this.OutputField = new Element("input", { id: "OutputField", type: "text" }).element;
        Head?.append(Icon);
        Body?.append(ColorChanger);
        Body?.append(Main);
        Main?.append(OutputSection);
        Main?.append(InputSection);
        OutputSection?.append(this.OutputField);
        ColorChanger.addEventListener("input", () => this.#changeColor(ColorChanger.value));
        this.OutputField.addEventListener("input", () => this.#removeError());
        const symbol = [
            { TextContent: "C", Function: this.#clear },
            { TextContent: "<x", Function: this.#removeSymbol },
            { TextContent: "mod", Function: this.#addOperation },
            { TextContent: "^", Function: this.#addSymbol },
            { TextContent: "(", Function: this.#addSymbol },
            { TextContent: ")", Function: this.#addSymbol },
            { TextContent: "%", Function: this.#addSymbol },
            { TextContent: "/", Function: this.#addOperation },
            { TextContent: "1", Function: this.#addSymbol },
            { TextContent: "2", Function: this.#addSymbol },
            { TextContent: "3", Function: this.#addSymbol },
            { TextContent: "*", Function: this.#addOperation },
            { TextContent: "4", Function: this.#addSymbol },
            { TextContent: "5", Function: this.#addSymbol },
            { TextContent: "6", Function: this.#addSymbol },
            { TextContent: "-", Function: this.#addOperation },
            { TextContent: "7", Function: this.#addSymbol },
            { TextContent: "8", Function: this.#addSymbol },
            { TextContent: "9", Function: this.#addSymbol },
            { TextContent: "+", Function: this.#addOperation },
            { TextContent: "π", Function: this.#addSymbol },
            { TextContent: "0", Function: this.#addSymbol },
            { TextContent: this.translation[1], Function: this.#addSymbol },
            { TextContent: "=", Function: this.#startCalculation }
        ];
        document.addEventListener("keydown", (event) => {
            const ActiveElement = document.activeElement;
            switch (event.key.toLowerCase()) {
                case "enter":
                    if (ActiveElement instanceof HTMLButtonElement) {
                        return;
                    }
                    this.#startCalculation();
                    break;
                case "c":
                    this.#clear();
                    break;
                default:
                    if (ActiveElement instanceof HTMLInputElement) {
                        return;
                    }
                    switch (event.key.toLowerCase()) {
                        case "backspace":
                            this.#removeSymbol();
                            break;
                        case "m":
                            this.#addOperation("mod");
                            break;
                        case "p":
                            this.#addSymbol("pi");
                            break;
                        case "^^":
                            this.#addSymbol("^");
                            break;
                    }
                    break;
            }
            for (let i = 2; i < symbol.length; i++) {
                const ActiveElement = document.activeElement;
                if (ActiveElement instanceof HTMLInputElement) {
                    return;
                }
                if (event.key == symbol[i]?.TextContent) {
                    symbol[i]?.Function(symbol[i]?.TextContent);
                }
            }
        });
        for (let i = 0; i < symbol.length; i++) {
            const NewElement = new Element("button", { textContent: `${symbol[i]?.TextContent}`, className: "inputButton" }).element;
            NewElement?.addEventListener("click", (event) => {
                symbol[i]?.Function(event.currentTarget?.textContent);
                event.currentTarget.blur();
            });
            InputSection?.append(NewElement);
        }
    };
    #clear = () => {
        this.OutputField.value = "";
    };
    #removeSymbol = () => {
        this.OutputField.value = this.OutputField.value.slice(0, -1);
    };
    #addSymbol = (value) => {
        this.OutputField.value = this.OutputField.value + value;
        this.#removeError();
    };
    #addOperation = (value) => {
        this.OutputField.value = this.OutputField.value + " " + value + " ";
        this.#removeError();
    };
    #removeError = () => {
        this.OutputField.value = this.OutputField.value.replaceAll(this.translation[0], "");
    };
    #startCalculation = () => {
        this.OutputField.value = this.#calculation(this.OutputField.value);
    };
    #calculation = (problem) => {
        const ReplaceListA = [",", "%", "π", "pi", "^", "mod"];
        const ReplaceListB = [".", "/100", "3.14159", "3.14159", "**", "%"];
        problem = problem.toLowerCase();
        for (let i = 0; i < ReplaceListA.length; i++) {
            problem = problem.replaceAll(ReplaceListA[i], ReplaceListB[i]);
        }
        try {
            if (/^[0-9+\-*\/%.() ]*$/.test(problem)) {
                problem = String(Math.round((eval(problem) * 1000)) / 1000);
                if (navigator.language.split("-")[0] == "de") {
                    problem = problem.replaceAll(ReplaceListB[0], ReplaceListA[0]);
                }
                return problem;
            }
            else {
                return String(this.translation[0]);
            }
        }
        catch {
            return String(this.translation[0]);
        }
    };
    #restoreSeason = () => {
        const Color = String(window.localStorage.getItem("color"));
        if (/^#[0-9A-Fa-f]{6}$/.test(Color)) {
            this.#changeColor(Color);
        }
        else {
            this.#changeColor("#1d7e00");
        }
    };
    #changeColor = (value) => {
        document.documentElement.style.setProperty('--main', value);
        window.localStorage.setItem("color", value);
        document.getElementById("ColorChanger").value = value;
        this.#changeIcon(value);
    };
    #changeIcon = (value) => {
        const Icon = document.getElementById("Icon");
        const Hex = value.replaceAll("#", "");
        Icon.href = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23${Hex}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='16' height='20' x='4' y='2' rx='2'/%3E%3Cline x1='8' x2='16' y1='6' y2='6'/%3E%3Cline x1='16' x2='16' y1='14' y2='18'/%3E%3Cpath d='M16 10h.01'/%3E%3Cpath d='M12 10h.01'/%3E%3Cpath d='M8 10h.01'/%3E%3Cpath d='M12 14h.01'/%3E%3Cpath d='M8 14h.01'/%3E%3Cpath d='M12 18h.01'/%3E%3Cpath d='M8 18h.01'/%3E%3C/svg%3E`;
    };
}
new Calculator;
export {};
