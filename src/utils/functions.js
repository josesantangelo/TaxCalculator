


export const calculateCategory = (price, categories) => {
    const current = categories.find(cat => price > cat.min && price <= cat.max);
    return current;
}

export const calculateTaxes = (year, taxBase, category, categories) => {
    let annualTax;
    if (category.id === 1) {
        annualTax = Math.round(taxBase * aliquot)
        return annualTax;
    }


    const { aliquot, fixedFee } = category;

    const previousCategoryMax = categories.find(cat => cat.id === category.id - 1).max


    if (year < 2022) {
        annualTax = Math.round(((taxBase * 0.95) - previousCategoryMax) * (aliquot) + fixedFee)
    }
    if (year === 2022) {
        annualTax = Math.round((taxBase - previousCategoryMax) * (aliquot) + fixedFee)
    }
    return annualTax

}

export const onSetTaxInfo = (e, setLoader, setInfo, carInfo, taxInfo, categories) => {
    setLoader(true)
    setTimeout(() => {
        const selectedYear = Number(e.target.value);
        const currentPrice = carInfo.price[selectedYear];
        const currentCategory = calculateCategory(currentPrice, categories);

        const taxTotal = calculateTaxes(selectedYear, currentPrice, currentCategory, categories);
        setInfo({
            ...taxInfo,
            year: selectedYear,
            taxValuation: currentPrice,
            taxBase: selectedYear < 2022 ? currentPrice * 0.95 : currentPrice,
            category: currentCategory.id,
            taxTotal: taxTotal
        })
        setLoader(false)
    }, 2000);

}

export const onChangeSelectedCar = (e, setcarInfo, cars) => {
    const id = e.target.value
    const selectedCar = cars.find(car => car.id === id)
    setcarInfo({ ...selectedCar })
};

export const clearInfo = (clearCarInfo, clearTaxInfo, initialCar, initialTax) => {
    clearCarInfo(initialCar)
    clearTaxInfo(initialTax);
}