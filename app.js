// Simple category options
const categoryOptions = {
  "Food": ["Dining out", "Groceries", "Snacks"],
  "Shopping": ["Amazon", "Electronics", "Clothing"],
  "Transportation": ["Cab", "Public Transport", "Fuel"]
};

// Update category details dropdown
document.getElementById("category").addEventListener("change", function() {
  const category = this.value;
  const detailSelect = document.getElementById("categoryValue");
  
  detailSelect.innerHTML = '<option value="">-- Select --</option>';
  
  if (category && categoryOptions[category]) {
    categoryOptions[category].forEach(item => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      detailSelect.appendChild(option);
    });
  }
});

// Form submission
document.getElementById("expenseForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  const payload = {
    authToken: "Rakesh9869",
    transactionType: document.getElementById("transactionType").value,
    expenseMode: document.getElementById("expenseMode").value || "",
    amount: document.getElementById("amount").value,
    category: document.getElementById("category").value,
    categoryValue: document.getElementById("categoryValue").value,
    additionalInfo: document.getElementById("additionalInfo").value || ""
  };

  // Basic validation
  if (!payload.transactionType || !payload.amount || !payload.category || !payload.categoryValue) {
    showResult("Please fill all required fields", "error");
    return;
  }

  try {
    showResult("Submitting...", "processing");
    
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbztTpELMxRl8SMYUpMHxDnDKkzO36En5LvJ0gMwmZA5LpO9ZY2QChCKKZJXqL5AFaYM/exec", 
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();
    
    if (result.status === "error") {
      throw new Error(result.message);
    }
    
    showResult("Entry saved successfully!", "success");
    document.getElementById("expenseForm").reset();
    document.getElementById("categoryValue").innerHTML = '<option value="">-- Select --</option>';
    
  } catch (error) {
    showResult("Error: " + error.message, "error");
    console.error("Submission error:", error);
  }
});

function showResult(message, type) {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = message;
  resultDiv.style.color = type === "error" ? "red" : type === "success" ? "green" : "blue";
}
