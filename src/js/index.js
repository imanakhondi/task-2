class Transactions {
  constructor() {
    this.loadingTransaction = document.getElementById("loadingTransaction");
    this.searchRefId = document.getElementById("searchRefId");
    this.transactions = document.querySelector(
      ".transactions__table-container"
    );
    this.loadingSpinner = document.getElementById("loadingSpinner");

    this.sortOrder = "asc";
    this.sortOrderDate = "asc";

    this.loadingTransaction.addEventListener("click", async () => {
      const data = await this.fetchData("http://localhost:3000/transactions");
      this.updateTableContent(data);
    });

    this.searchRefId.addEventListener("input", async (e) => {
      const data = await this.fetchData(
        `http://localhost:3000/transactions?refId_like=${e.target.value}`
      );
      this.updateTableContent(data);
    });
  }

  async fetchData(url) {
    try {
      this.loadingSpinner.classList.add("loading--active");
      const res = await fetch(url);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      this.loadingSpinner.classList.remove("loading--active");
    }
  }

  sortingData(data) {
    const sortPrice = document.querySelector("#sortPrice");
    const sortDate = document.querySelector("#sortDate");

    sortPrice.addEventListener("click", async () => {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
      if (data && data.length) {
        const sortedData = data.sort((a, b) =>
          this.sortOrder === "asc" ? a.price - b.price : b.price - a.price
        );
        this.updateTableContent(sortedData);
      } else {
        const sortedData = await this.fetchData(
          `http://localhost:3000/transactions?_sort=price&_order=${this.sortOrder}`
        );
        this.updateTableContent(sortedData);
      }
    });

    sortDate.addEventListener("click", async () => {
      this.sortOrderDate = this.sortOrderDate === "asc" ? "desc" : "asc";

      if (data && data.length) {
        const sortedData = data.sort((a, b) =>
          this.sortOrderDate === "asc"
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date)
        );
        this.updateTableContent(sortedData);
      } else {
        const sortedData = await this.fetchData(
          `http://localhost:3000/transactions`
        );
        const finalData = sortedData.sort((a, b) =>
          this.sortOrderDate === "asc"
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date)
        );
        this.updateTableContent(finalData);
      }
    });
  }

  generateTableRows(data) {
    return data
      .map((item) => {
        const typeColor = item.type === "افزایش اعتبار" ? "#ACD373" : "#FF5252";
        return `<tr>
          <td>${item.id}</td>
          <td style="color:${typeColor}">${item.type}</td>
          <td>${item.price}</td>
          <td>${item.refId}</td>
          <td>${new Date(item.date).toLocaleDateString(
            "fa-IR"
          )} ساعت ${new Date(item.date).toLocaleTimeString("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}</td>
        </tr>`;
      })
      .join("");
  }

  updateTableContent(data) {
    this.loadingTransaction.style.display = "none";

    this.transactions.innerHTML = ` <table>
     <thead>
      <tr>
        <th>ردیف</th>
        <th>نوع تراکنش</th>
        <th id="sortPrice">
          <span>مبلغ</span>
          <i class="fa-solid fa-chevron-up sort-icon" style="transform: ${
            this.sortOrder === "asc" ? "rotate(0deg)" : "rotate(180deg)"
          };"></i>
        </th>
        <th>شماره پیگیری</th>
        <th id="sortDate">
          <span>تاریخ تراکنش</span>
          <i class="fa-solid fa-chevron-up sort-icon" style="transform: ${
            this.sortOrderDate === "asc" ? "rotate(0deg)" : "rotate(180deg)"
          };"></i>
        </th>
      </tr>
     </thead>
     <tbody>
       ${this.generateTableRows(data)}
     </tbody>
    </table>`;

    this.sortingData(data);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const transactions = new Transactions();
});