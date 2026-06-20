let expression = "";

let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

const display = document.querySelector("#disp");

const themeToggle = document.querySelector("#theme-toggle");

const historyIcon = document.querySelector("#history-icon");
 
const panel = document.querySelector("#panel");

const historyList = document.querySelector("#panel ul");

const sciToggle = document.querySelector("#sci-toggle");

const sciPanel = document.querySelector("#scientific-panel");

const normalBtns = document.querySelector("#normal-btns");

const buttons = document.querySelectorAll("button");

updateHistoryUI();

if(localStorage.getItem("theme") == "light") {
    document.documentElement.classList.add("Light");
    themeToggle.textContent = "🌙";
   }

   themeToggle.addEventListener("click", () => {
    themeToggle.blur();
    document.documentElement.classList.toggle("light");
    themeToggle.textContent = document.documentElement.classList.contains("light") ? "🌙" : "☀️";
   })

    localStorage.setItem("theme", document.documentElement.classList.contains("Light") ? "light" : "dark");


  historyIcon.addEventListener("click", ()=> {
      panel.classList.toggle("active");   
});

    sciToggle.addEventListener("click", () => {
               sciPanel.classList.toggle("active");

              normalBtns.classList.toggle("shrink");
              sciToggle.textContent = sciPanel.classList.contains("active") ? "▼ sci" : "▲ sci";
    });


function calculate(value) {
    if(value == "▲ sci" || value == "▼ sci" || value == "☀️" || value == "🌙") return;

    if(["Shift", "CapsLock", "Control", "Alt", "Tab"].includes(value)) return;

    if(display.value == "Invalid Expression" || display.value == "Can't divide by zero") {
          expression = "";
    }
    
    if(value == "AC" || value == "Escape") expression = "";
    else if(value == "X" || value == "Backspace") expression = expression.slice(0, -1);
    else if(value == "=" || value == "Enter") {
      if(expression == "") return;
        try {
    let expr = expression
        .replace(/\^/g, "**")
        .replace(/√\(/g, "Math.sqrt(")
        .replace(/π/g, "Math.PI")
        .replace(/sin\(/g, "Math.sin(")
        .replace(/cos\(/g, "Math.cos(")
        .replace(/tan\(/g, "Math.tan(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/e/g, "Math.E");
             

        let result = eval(expr);
        if(result == Infinity || result == -Infinity) {
            expression = "Can't divide by zero";
        }else if(isNaN(result)) {
               expression = "Invalid Expression";
        }else {
        history.push(expression + " = " + result); 

      localStorage.setItem("calcHistory", JSON.stringify(history));

      updateHistoryUI();
      expression = String(result);

    //   historyList.innerHTML = history.slice(-10).map(item => `<li>${item}</li>`).join("");
    //   localStorage.setItem("calcHistory", JSON.stringify(history));
        }
    } catch(error) {
           expression = "Invalid Expression";
    }
}
    else if(value == "()" ) {
        countOfOpeningBracket = expression.split("(").length - 1;
        countOfClosingBracket  = expression.split(")").length - 1;
        if(countOfOpeningBracket > countOfClosingBracket) expression += ")";
        else expression += "(";
    }else if (value === "%") {
    expression += "%";
 
  } else if (value === "π") {
    expression += "π";
 
  } else if (value === "√") {
    expression += "√(";
 
  } else if (value === "^") {
    expression += "^";
    } else if (value === "!") {
    // factorial — compute immediately on last number
    let num = parseInt(expression);
    if (!isNaN(num) && num >= 0 && num <= 20) {
      let fact = 1;
      for (let i = 2; i <= num; i++) fact *= i;
      expression = String(fact);
    }
   } else if (value === "sin" || value === "cos" || value === "tan" || value === "ln" || value === "log") {
    expression += value + "(";
 
  } else if (value === "e") {
    expression += "e";
 
  } else if (value === "Rad") {
    // toggle indicator only — no-op for now
    return;
 
  } else if (value === "Inv") {
    // placeholder
    return;
  }
    else expression += value;

    display.value = expression;
}

buttons.forEach(function(button) {
    button.addEventListener("click", (e) => {
      calculate(e.target.innerText);
    });
});

document.addEventListener("keydown", (e)=> {
    calculate(e.key);
});

function updateHistoryUI() {
    historyList.innerHTML = history.slice(-10).map(item => `<li>${item}</li>`).join("");
}




