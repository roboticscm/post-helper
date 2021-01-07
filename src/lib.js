export const milliToDateStr = (millisecond) => {
    if (!millisecond) {
        return '';
      }
  
      const date = new Date(millisecond);
      return date.toLocaleDateString('vi-VN');
}

export const selectOptionByText = async (page, seletctId, textWanted) => {

  const optionWaned = (await page.$x(`//*[@id = "${seletctId}"]/option[contains(., "${textWanted}")]`))[0];

  const opionValue = await (await optionWaned .getProperty('value')).jsonValue();

  await page.select(`#${seletctId}`, opionValue);
}

export const selectOption2ByText = async (page, seletctName, textWanted) => {

  const optionWaned = (await page.$x(`//*[@name = "${seletctName}"]/option[contains(., "${textWanted}")]`))[0];

  const opionValue = await (await optionWaned .getProperty('value')).jsonValue();

  await page.select(`select[name="${seletctName}"]`, opionValue);
}

export const waitForNetworkIdle = (page, timeout = 3000, maxInflightRequests = 0) => {
  page.on('request', onRequestStarted);
  page.on('requestfinished', onRequestFinished);
  page.on('requestfailed', onRequestFinished);

  let inflight = 0;
  let fulfill;
  let promise = new Promise(x => fulfill = x);
  let timeoutId = setTimeout(onTimeoutDone, timeout);
  return promise;

  function onTimeoutDone() {
    page.removeListener('request', onRequestStarted);
    page.removeListener('requestfinished', onRequestFinished);
    page.removeListener('requestfailed', onRequestFinished);
    fulfill();
  }

  function onRequestStarted() {
    ++inflight;
    if (inflight > maxInflightRequests)
      clearTimeout(timeoutId);
  }

  function onRequestFinished() {
    if (inflight === 0)
      return;
    --inflight;
    if (inflight === maxInflightRequests)
      timeoutId = setTimeout(onTimeoutDone, timeout);
  }
}