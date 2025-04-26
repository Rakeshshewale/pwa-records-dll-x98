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
  } else {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "-- Select Category First --";
    subcategory.appendChild(opt);
  }
});

// Handle form submission
document.getElementById("expenseForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const transactionType = document.querySelector("input[name='transactionType']:checked")?.value;
  const expenseMode = document.querySelector("input[name='expenseMode']:checked")?.value || "";
  const amount = document.querySelector("input[name='amount']").value;
  const category = document.getElementById("category").value;
  const categoryValue = document.getElementById("categoryValue").value;
  const additionalInfo = document.querySelector("input[name='additionalInfo']").value || "";

  if (!transactionType || !amount) {
    document.getElementById("result").textContent = "Transaction type and amount are required.";
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

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbx_wHyePe_GKAA9YBmpccIyPkYrKikyfosaWmhVJxZH1_MActOeD0IETvVIhnu2g_-O/exec", {
      method: "POST",
      // mode: 'no-cors',
      // body: JSON.stringify(payload),
        headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: payload
    });

    const result = await response.json();
    document.getElementById("result").textContent = result.message || "Entry submitted successfully.";
    document.getElementById("expenseForm").reset();
    document.getElementById("categoryValue").innerHTML = "<option>-- Select Category First --</option>";
  } catch (err) {
    document.getElementById("result").textContent = "Error submitting entry. Try again.";
    console.error(err);
  }
});
