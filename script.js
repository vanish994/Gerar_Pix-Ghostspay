const form = document.getElementById('pixForm');
const result = document.getElementById('result');
const statusEl = document.getElementById('status');
const pixCode = document.getElementById('pixCode');
const qrImage = document.getElementById('qrImage');
const copyBtn = document.getElementById('copyBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    name: "João da Silva",
    email: "joao@example.com",
    cpf: "01234567890",
    phone: "+5516999999999",
    paymentMethod: "PIX",
    amount: 1000,
    traceable: true,
    items: [{
      unitPrice: 1000,
      title: "Serviço Vanish",
      quantity: 1,
      tangible: false
    }]
  };

  try {
    const response = await fetch("https://app.ghostspaysv1.com/api/v1/transaction.purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "db273228-fdbc-4436-8350-d44b8c3498f9"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.pixCode && data.pixQrCode) {
      statusEl.textContent = "Pendente";
      pixCode.value = data.pixCode;
      qrImage.src = data.pixQrCode;
      result.classList.remove("hidden");
    } else {
      statusEl.textContent = "Erro ao gerar";
    }
  } catch (error) {
    console.error("Erro:", error);
    statusEl.textContent = "Erro na requisição";
  }
});

copyBtn.addEventListener('click', () => {
  pixCode.select();
  document.execCommand('copy');
});
