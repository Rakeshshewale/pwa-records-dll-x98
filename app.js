// Category options mapping
const categoryOptions = {
  "Shopping": ["Amazon", "Shopping mart", "Electronics", "Clothing", "Other"],
  "Food": ["Dining out", "Snacks", "Food deliveries", "Groceries", "Fruit"],
  "Transportation": ["Public transport", "Cab", "Flight/Hotel", "Rental vehicle", "Other"],
  "Bills": ["Electricity", "Rent", "Phone bills", "Cable", "Other"],
  "Entertainment": ["Ytube+", "Apple account", "Outings", "Movies", "Other"],
  "Personal care": ["Medical", "Hair saloon spa", "Cosmetics", "Dr appointments", "Other"],
  "Insurance": ["LIC", "Health Insurance", "Term Insurance"],
  "Other Expenses": ["Splitwise pay", "Laundry", "Career", "Vacation", "Other"],
  "Money transfer": [
    "Salary to Kotak", "Salary to ICICI", "ICICI to Kotak", "Kotak to ICICI", "Cash withdrawal",
    "Salary", "Investment", "Other income", "E-wallet topup"
  ],
  "Opening balance": ["E-wallet balance", "ICICI balance", "HDFC balance", "Kotak Balance", "Cash"]
};

// Show/hide Expense Mode based on Transaction Type
document.querySelectorAll("input[name='transactionType']").forEach((radio) => {
  radio.addEventListener("change", function () {
    const expenseModeSection = document.getElementById("expenseModeSection");
    if (this.value === "Expense") {
      expenseModeSection.style.display = "block";
    } else {
      expenseModeSection.style.display = "none";
    }
  });
});

// Initially hide Expense Mode (until user selects "Expense")
document.getElementById("expenseModeSection").style.display = "none";


// Handle transactionType change to adjust category options
document.querySelectorAll("input[name='transactionType']").forEach(radio => {
  radio.addEventListener("change", function () {
    const selectedTransaction = this.value;
    const category = document.getElementById("category");
    const categoryValue = document.getElementById("categoryValue");

    category.innerHTML = "";
    categoryValue.innerHTML = "";
    category.disabled = false;
    categoryValue.disabled = false;

    if (selectedTransaction === "Expense") {
      const expenseCategories = [
        "Shopping", "Food", "Transportation", "Bills", "Entertainment",
        "Personal care", "Insurance", "Other Expenses"
      ];
      expenseCategories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        category.appendChild(opt);
      });
    } else if (selectedTransaction === "Money transfer") {
      const transferCategories = ["Money transfer", "Opening balance"];
      transferCategories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        category.appendChild(opt);
      });
    } else if (selectedTransaction === "Credit card bill") {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "-- No category needed --";
      category.appendChild(opt);
      category.disabled = true;
      categoryValue.disabled = true;
    }

    // Trigger categoryValue update
    category.dispatchEvent(new Event('change'));
  });
});

// Set up categoryValue options based on selected category
document.getElementById("category").addEventListener("change", function () {
  const selected = this.value;
  const subcategory = document.getElementById("categoryValue");
  subcategory.innerHTML = "";

  if (categoryOptions[selected]) {
    categoryOptions[selected].forEach(item => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      subcategory.appendChild(opt);
    });
    subcategory.disabled = false;
  } else {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "-- Select Category First --";
    subcategory.appendChild(opt);
    subcategory.disabled = true;
  }
});

// Handle form submission
document.getElementById("expenseForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const submitButton = document.querySelector("#submitButton"); 
  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  const transactionType = document.querySelector("input[name='transactionType']:checked")?.value;
  const expenseMode = document.querySelector("input[name='expenseMode']:checked")?.value || "";
  const amount = document.querySelector("input[name='amount']").value;
  const category = document.getElementById("category").value;
  const categoryValue = document.getElementById("categoryValue").value;
  const additionalInfo = document.querySelector("input[name='additionalInfo']").value || "";

  if (!transactionType || !amount) {
    document.getElementById("result").textContent = "Transaction type and amount are required.";
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
    return;
  }

  const payload = {
    authToken: "Rakesh9869",  
    transactionType,
    expenseMode,
    amount,
    category,
    categoryValue,
    additionalInfo
  };

  const formData = new URLSearchParams();
  formData.append("authToken", payload.authToken);
  formData.append("transactionType", payload.transactionType);
  formData.append("expenseMode", payload.expenseMode);
  formData.append("amount", payload.amount);
  formData.append("category", payload.category);
  formData.append("categoryValue", payload.categoryValue);
  formData.append("additionalInfo", payload.additionalInfo);

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbx_wHyePe_GKAA9YBmpccIyPkYrKikyfosaWmhVJxZH1_MActOeD0IETvVIhnu2g_-O/exec", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    document.getElementById("result").textContent = result.message || "Entry submitted successfully.";
    document.getElementById("expenseForm").reset();
    document.getElementById("category").innerHTML = "<option>-- Select Category --</option>";
    document.getElementById("categoryValue").innerHTML = "<option>-- Select Category First --</option>";
    document.getElementById("category").disabled = false;
    document.getElementById("categoryValue").disabled = false;
  } catch (err) {
    document.getElementById("result").textContent = "Error submitting entry. Try again.";
    console.error(err);
  }
  finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  }
});

// Handle Clear button
document.getElementById("clearButton").addEventListener("click", function () {
  document.getElementById("expenseForm").reset();
  document.getElementById("category").innerHTML = "<option>-- Select Category --</option>";
  document.getElementById("categoryValue").innerHTML = "<option>-- Select Category First --</option>";
  document.getElementById("category").disabled = false;
  document.getElementById("categoryValue").disabled = false;
  document.getElementById("result").textContent = "";
});
