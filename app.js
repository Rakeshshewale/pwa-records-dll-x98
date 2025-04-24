// [Previous categoryOptions and event listener code remains exactly the same...]

// Handle form submission
document.getElementById("expenseForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  
  const submitBtn = document.querySelector("#expenseForm button[type='submit']");
  const resultDiv = document.getElementById("result");

  try {
    // Get form values
    const transactionType = document.querySelector("input[name='transactionType']:checked")?.value;
    const expenseMode = document.querySelector("input[name='expenseMode']:checked")?.value || "";
    const amount = document.querySelector("input[name='amount']").value;
    const category = document.getElementById("category").value;
    const categoryValue = document.getElementById("categoryValue").value;
    const additionalInfo = document.querySelector("input[name='additionalInfo']").value || "";

    // Validate
    if (!transactionType || !amount) {
      resultDiv.textContent = "Transaction type and amount are required.";
      resultDiv.style.color = "red";
      return;
    }

    // Prepare payload
    const payload = {
      authToken: "Rakesh9869",
      transactionType,
      expenseMode,
      amount: parseFloat(amount), // Ensure number type
      additionalInfo,
      [category]: categoryValue
    };

    console.log("Submitting payload:", payload); // Debug log

    // Submit
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    
    const response = await fetch("https://script.google.com/macros/s/AKfycbztTpELMxRl8SMYUpMHxDnDKkzO36En5LvJ0gMwmZA5LpO9ZY2QChCKKZJXqL5AFaYM/exec", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    const result = await response.json();
    console.log("Server response:", result); // Debug log

    if (result.status === "error") {
      throw new Error(result.message || "Server rejected the submission");
    }

    // Success
    resultDiv.textContent = "Entry submitted successfully!";
    resultDiv.style.color = "green";
    document.getElementById("expenseForm").reset();
    document.getElementById("categoryValue").innerHTML = "<option>-- Select Category First --</option>";

  } catch (err) {
    console.error("Submission error:", err);
    resultDiv.textContent = err.message || "Error submitting entry. Please try again.";
    resultDiv.style.color = "red";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
});
