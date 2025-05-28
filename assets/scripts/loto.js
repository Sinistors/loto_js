function randomRange(first, last) {
    return first + Math.floor(Math.random() * last);
}


class LotoGrid
{
    name;
    mainCases = [];
    luckyCases = [];

    mainChoices = [];
    luckyChoice;

    choicesElement;

    constructor(name, nbMainCases, nbLuckyCases)
    {
        this.name = name;
        let gridTitleElement = document.createElement("h1");
        gridTitleElement.innerText = name;
        document.querySelector("#grids").appendChild(gridTitleElement);

        let parentGridElement = document.createElement("div");
        document.querySelector("#grids").appendChild(parentGridElement);
        parentGridElement.id = this.name;
        parentGridElement.classList.add("gridParent");

        let mainGrid = document.createElement("div");
        mainGrid.classList.add("grid");
        parentGridElement.appendChild(mainGrid);

        for (let i = 1; i <= nbMainCases; i++)
        {
            let newCase = document.createElement("div");
            newCase.innerText = i;
            newCase.classList.add("mainCase");
            mainGrid.appendChild(newCase);
            this.mainCases.push(newCase);
            this.addEventOnClick(newCase);
        }

            let luckyGrid = document.createElement("div");
            luckyGrid.classList.add("grid");
            parentGridElement.appendChild(luckyGrid);

        for (let i = 1; i <= nbLuckyCases; i++)
        {
            let newCase = document.createElement("div");
            newCase.innerText = i;
            newCase.classList.add("luckyCase");
            luckyGrid.appendChild(newCase);
            this.luckyCases.push(newCase);
            this.addEventOnClick(newCase);
        }

        this.choicesElement = document.createElement("div");
        document.querySelector("#grids").appendChild(this.choicesElement);
        this.choicesElement.classList.add("choices");
        this.choicesElement.classList.add("d-none");
    }

    addEventOnClick(caseElement) 
    {
        caseElement.addEventListener("click", () =>
        {
            let isAdded;
            if (caseElement.classList.contains("mainCase"))
            {
                if (this.mainChoices.length >= 5 && !caseElement.classList.contains("selected"))
                {
                    return;
                }
                let isAdded = caseElement.classList.toggle("selected");
                if (isAdded)
                {
                    this.mainChoices.push(caseElement.innerText);
                }
                else
                {
                    let index = this.mainChoices.indexOf(caseElement.innerText);
                    this.mainChoices.splice(index, 1);
                }
            }
            else
            {
                this.luckyCases.forEach(luckyCase => 
                {
                    if (luckyCase.classList.contains("selected"))
                    {
                        luckyCase.classList.remove("selected");
                    }  
                });
                caseElement.classList.add("selected");
                this.luckyChoice = caseElement.innerText;
            }

            this.choicesElement.innerHTML = "";
            this.mainChoices.forEach(choice => 
            {
                let newElement = document.createElement("div");
                newElement.innerText = choice;
                newElement.classList.add("mainCase");
                newElement.classList.add("selected");
                this.choicesElement.appendChild(newElement);
            });
            if (this.luckyChoice == undefined)
            {
                return;
            }
            let newElement = document.createElement("div");
            newElement.innerText = this.luckyChoice;
            newElement.classList.add("luckyCase");
            newElement.classList.add("selected");
            this.choicesElement.appendChild(newElement);
        })
    }

    isGridFinished()
    {
        return this.mainChoices.length == 5 && this.luckyChoice != undefined;
    }

    switchDisplay()
    {
        this.choicesElement.classList.toggle("d-none");
        this.mainCases.forEach(element => 
        {
            element.classList.toggle("d-none");
        });
        this.luckyCases.forEach(element => 
        {
            element.classList.toggle("d-none");
        });
    }
    closeGrid()
    {
        if (!this.isGridFinished())
        {
            return;
        }
        if (this.choicesElement.classList.contains("d-none"))
        {
            this.choicesElement.classList.remove("d-none");
        }
        
        this.mainCases.forEach(element => 
        {
            if (!element.classList.contains("d-none"))
            {
                element.classList.add("d-none");
            }
        });
        this.luckyCases.forEach(element => 
        {
            if (!element.classList.contains("d-none"))
            {
                element.classList.add("d-none");
            }
        });
    }

    displayScore(mainGrid, luckyNb)
    {
        const body = document.querySelector("body");

        let mainGridCount = 0;
        let moneyGained = 0;
        this.mainChoices.forEach(choice => 
        {
            if (mainGrid.includes(parseInt(choice)))
            {
                mainGridCount++;
            }
        });
        switch (mainGridCount) 
        {
            case 2:
            moneyGained = (luckyNb != this.luckyChoice)? 2:3;
                break;
                case 3:
            moneyGained = (luckyNb != this.luckyChoice)? 8:10;
                break;
                case 4:
            moneyGained = (luckyNb != this.luckyChoice)? 200:500;
                break;
                case 5:
            moneyGained = (luckyNb != this.luckyChoice)? 100000:500000;
                break;
        
            default:
                break;
        }
        const title = document.createElement("h2");
        title.innerText = this.name + " " + moneyGained + "€";
        body.appendChild(title);

        let resultDiv = document.createElement("div");
        resultDiv.classList.add("choices");
        body.appendChild(resultDiv);
        this.mainChoices.forEach(choice => 
        {
            let newElement = document.createElement("div");
            newElement.innerText = choice;
            newElement.classList.add("mainCase");
            newElement.classList.add("selected");
            resultDiv.appendChild(newElement);
        });

        let newElement = document.createElement("div");
        newElement.innerText = this.luckyChoice;
        newElement.classList.add("luckyCase");
        newElement.classList.add("selected");
        resultDiv.appendChild(newElement);
    }
}
let grids = [];
grids.push(new LotoGrid("Grille 1", 49, 10));
let newGridBtnElement = document.querySelector("#newGridBtn");
let playBtnElement = document.querySelector("#play");

newGridBtnElement.onclick = function AddGrid() 
{
    grids.forEach(grid => 
    {
        grid.closeGrid();    
    });
    grids.push(new LotoGrid("Grille " + (grids.length + 1), 49, 10));
}

playBtnElement.onclick = function Play() 
{
    let newGrids = [];
    let deleteGrid = [];
    for (let i = 0; i < grids.length; i++)
    {
        if (grids[i].isGridFinished())
        {
            newGrids.push(grids[i]);
        }
    }
    grids = newGrids;
    let body = document.querySelector("body");
    body.innerHTML = "";

    let resultTitle = document.createElement("h1");
    resultTitle.innerText = "Resultats :";
    body.appendChild(resultTitle);

    let resultMain = [];
    let resultLucky = randomRange(1,10);
    for (let i = 0; i < 5; i++)
    {
        let random = randomRange(1,49);
        if (resultMain.includes(random))
        {
            i--;
        }
        else
        {
            resultMain.push(randomRange(1,49));
        }
    }

    // Cheat code to test
    // resultMain = [1,2,3,4,5]; 
    // resultLucky = 1;

    let resultDiv = document.createElement("div");
    resultDiv.classList.add("choices");
    body.appendChild(resultDiv);
    resultMain.forEach(result => 
    {
        let newElement = document.createElement("div");
        newElement.innerText = result;
        newElement.classList.add("mainCase");
        newElement.classList.add("selected");
        resultDiv.appendChild(newElement);
    });

    let newElement = document.createElement("div");
    newElement.innerText = resultLucky;
    newElement.classList.add("luckyCase");
    newElement.classList.add("selected");
    resultDiv.appendChild(newElement);

    grids.forEach(grid => 
    {
        grid.displayScore(resultMain, resultLucky);    
    });

    const resetBtn = document.createElement("button");
    body.appendChild(resetBtn);
    resetBtn.classList.add("btn");
    resetBtn.innerText = "Réessayer"
    resetBtn.onclick = function Refresh() 
    {
        location.reload();
    }
}