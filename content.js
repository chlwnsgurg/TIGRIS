function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function registerSchedule() {
    console.log("Registering schedule");
}
  
async function setReminders() {

    console.log("Setting reminders");
    const scheduleList=document.querySelector("#content > section > div.scheduleList.gContentCardShadow")
    const dailyScheduleList=scheduleList.childNodes[3]
    for (const dailyItem of dailyScheduleList.childNodes) {
        const [year, month, day] = dailyItem.childNodes[0].getAttribute('datetime').split(' ').map(item => parseInt(item.slice(0, -1)), 10);
        const date = new Date(year, month - 1, day);
        const weekday = date.getDay();
        const eventList=dailyItem.childNodes[2];
        for (const scheduleItem of eventList.childNodes) {
            const title = scheduleItem.querySelector('.title');
            if (title && title.textContent === '정기대관') {
                async function create(is_today) {
                    scheduleItem.click();
                    await sleep(1000);
                    
                    const moreOptionsButton = document.querySelector('button.postSet._moreButton');
                    moreOptionsButton.click();
                    await sleep(250);

                    const writePostButton = document.querySelector('button._optionMenuLink[data-menu-id="WRITE_POST"]');
                    writePostButton.click();
                    await sleep(750);

                    const payload = document.querySelector("#wrap > div.layerContainerView > div:nth-child(2) > div > section > div > div > div > div.postWriteForm._postWriteForm.-standby > div > p:nth-child(1)");
                    
                    if(is_today){
                        payload.innerText = `오늘 대관투표는 17:${(30-15*weekday).toString().padStart(2, '0')} 까지입니다` + payload.innerText;
                    } else{
                        payload.innerText = `내일 대관투표는 17:${(30-15*weekday).toString().padStart(2, '0')} 까지입니다` + payload.innerText;
                    }

                    const writeSettingsButton = document.querySelector('.btnSetting._btnWriteSetting');
                    writeSettingsButton.click();
                    await sleep(250);

                    document.querySelector("#reserve").click();
                    await sleep(500);

                    const datePicker = document.querySelector("#wrap > div.layerContainerView > div:nth-child(3) > section > div > div > div > ul > li:nth-child(3) > div.reserveDataSettingWrap._reserveDateWrap > div.optionDateTime.gMat-4.gMab7 > div > div.flexItem.-calendar._dateInput > div");
                    datePicker.firstChild.click();
                    await sleep(250);

                    while (document.querySelector(".datePickerRegion > div > div > div > .monthTxt").innerText.split(' ')[1].slice(0, -1) != month) {
                        document.querySelector("button.btnNextMonth._nextMonthButton").click();
                        await sleep(250);
                    }

                    if(is_today){
                        document.querySelector(`td._td a[data-day="${day}"]`).click();
                    } else{
                        if(day == '1'){
                            console.log("1일 대관에 대한 전날 리마인더는 직접 작성하세요!");
                        } else{
                            document.querySelector(`td._td a[data-day="${day-1}"]`).click();
                        }
                    }
                    await sleep(250);

                    if(is_today){
                        document.querySelector('.btnDropDownItem[data-time="오전 11:00"]').click();
                    } else{
                        document.querySelector('.btnDropDownItem[data-time="오후 7:00"]').click();
                    }
                    await sleep(250);

                    const confirmButton = document.querySelector('button.uButton.-confirm._btnComplete');
                    confirmButton.click();
                    await sleep(250);

                    const uploadButton = document.querySelector('button.uButton.-sizeM.-confirm._btnSubmitPost');
                    uploadButton.click();
                    await sleep(500);
                    await (async function handleAlert() {
                        const skipButton = document.querySelector('section[data-viewname="DAlertModalView"] > div > div.modalFooter > button')
                        if (skipButton) {
                            skipButton.click();
                            await sleep(60000); // sleep for 1 minute
                            const uploadButton = document.querySelector('button.uButton.-sizeM.-confirm._btnSubmitPost');
                            uploadButton.click();
                            await sleep(500);
                        } 
                    })();
                    
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

