function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function registerSchedule() {
    console.log("Registering schedule");
}
  
async function setReminders() {
    console.log("Setting reminders");
    let scheduleList=document.querySelector("#content > section > div.scheduleList.gContentCardShadow")
    let dailyScheduleList=scheduleList.childNodes[3]
    for (let dailyItem of dailyScheduleList.childNodes) {
        let [year, month, day] = dailyItem.childNodes[0].getAttribute('datetime').split(' ').map(item => String(parseInt(item.slice(0, -1)), 10));
        console.log(year, month, day)
        const eventList=dailyItem.childNodes[2];
        for (let scheduleItem of eventList.childNodes) {
            const title = scheduleItem.querySelector('.title');
            if (title && title.textContent === '정기대관') {
                async function create(is_today) {
                    scheduleItem.click();
                    console.log(scheduleItem);
                    await sleep(500);
                    
                    let moreOptionsButton = document.querySelector("#wrap > div.layerContainerView > div > section > div > div:nth-child(1) > div > div > div.scheduleHead._scheduleHead > div.option > button");
                    console.log(moreOptionsButton);
                    moreOptionsButton.click();
                    await sleep(100);

                    let writePostButton = document.querySelector("._moreOptionListRegion > ul > li:nth-child(3) > button");
                    writePostButton.click();
                    await sleep(750);

                    let payload = document.querySelector("#wrap > div.layerContainerView > div:nth-child(2) > div > section > div > div > div > div.postWriteForm._postWriteForm.-standby > div > p:nth-child(1)");
                    payload.innerText = "오늘 대관투표는 17:30까지입니다" + payload.innerText;

                    let writeSettingsButton = document.querySelector("#wrap > div.layerContainerView > div:nth-child(2) > div.layer_wrap.ui-draggable.ui-draggable-handle.skin6 > section > div > div > div > div.buttonArea._bottomToolbar > div > div.settingArea > button");
                    writeSettingsButton.click();
                    await sleep(100);

                    document.querySelector("#reserve").click();
                    await sleep(100);

                    let datePicker = document.querySelector("#wrap > div.layerContainerView > div:nth-child(3) > section > div > div > div > ul > li:nth-child(3) > div.reserveDataSettingWrap._reserveDateWrap > div.optionDateTime.gMat-4.gMab7 > div > div.flexItem.-calendar._dateInput > div");
                    datePicker.firstChild.click();
                    await sleep(100);

                    while (document.querySelector(".datePickerRegion > div > div > div > .monthTxt").innerText.split(' ')[1].slice(0, -1) != month) {
                        document.querySelector("button.btnNextMonth._nextMonthButton").click();
                        await sleep(100);
                    }

                    document.querySelector(`td._td a[data-day="${day}"]`).click();
                    await sleep(100);

                    document.querySelector('.btnDropDownItem[data-time="오전 11:00"]').click();
                    await sleep(100);

                    let confirmButton = document.querySelector("#wrap > div.layerContainerView > div:nth-child(3) > section > div > footer > button.uButton.-confirm._btnComplete");
                    confirmButton.click();
                    await sleep(100);

                    let uploadButton = document.querySelector("#wrap > div.layerContainerView > div:nth-child(2) > div > section > div > div > div > div.buttonArea._bottomToolbar > div > div.buttonSubmit > button");
                    uploadButton.click();
                    await sleep(1000);
                }
                await create(true);
                await create(false);
                
            }
        }
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.message) {
            case "schedule":
                registerSchedule();
                break;
            case "reminder":
                setReminders();
                break;
            default:
        }
    }
);

