const apiUrl = 'https://interview-task-api.mca.dev/qr-scanner-codes/alpha-qr-gFpwhsQ8fkY1'

function sortItems (a, b) {
    const nameA = a.name.toLowerCase()
    const nameB = b.name.toLowerCase()

    if (nameA < nameB)
        return - 1;
    if (nameA > nameB)
        return 1;
    return 0;
}

function formatPrice (price) {
    return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        useGrouping: true,
    }).format(price).replace(".",",");
}

function formatReceipt (data) {
    let receipt = "";

    data.forEach((item) => {
        receipt = receipt + "... " + item.name + "\n";
        receipt = receipt + "    Price: " + formatPrice(item.price) + "\n";
        receipt = receipt + "    " + item.description.slice(0,10) + "...\n";
        receipt = receipt + "    Weight: ";
        if ("weight" in item)
            receipt = receipt + item.weight + "g";
        else
            receipt = receipt + "N/A";
        receipt = receipt + "\n";
    })

    return receipt;
}

function processReceiptData (receiptData) {
    const domesticItems = [], importedItems = [];
    let domesticCost = 0, importedCost = 0, domesticCount = 0, importedCount = 0;
    let receipt;

    receiptData.forEach((item) => {
        if (item.domestic === true) {
            domesticItems.push(item);
            domesticCost += item.price;
            domesticCount++;
        }
        else {
            importedItems.push(item);
            importedCost += item.price;
            importedCount++;
        }
    })

    domesticItems.sort((a, b) => sortItems(a, b));
    receipt = ". Domestic\n";
    receipt = receipt + formatReceipt(domesticItems);

    importedItems.sort((a, b) => sortItems(a, b));
    receipt = receipt + ". Imported\n";
    receipt = receipt + formatReceipt(importedItems);

    receipt = receipt + "Domestic cost: " + formatPrice(domesticCost) + "\n";
    receipt = receipt + "Imported cost: " + formatPrice(importedCost) + "\n";
    receipt = receipt + "Domestic count: " + domesticCount + "\n";
    receipt = receipt + "Imported count: " + importedCount + "\n";

    return receipt;
}

fetch(apiUrl)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log(processReceiptData(data));
    })
    .catch((error) => {
        console.error('Fetch error:', error);
    });