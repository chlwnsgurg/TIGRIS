function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  }
  
MONTHNAME=["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
LASTDAY=[31,28,31,30,31,30,31,31,30,31,30,31];

async function registerSchedule() {
    let MONTH=parseInt(document.querySelector("#content > section > div.calendarViewWrap.gContentCardShadow > div:nth-child(1) > div.calendarHeader > div.month > strong").textContent.split(' ')[1].slice(0,-1),10);
    console.log("Register schedule of "+MONTHNAME[MONTH-1]);

    async function createSchedule(weekday) {
        const day=document.querySelector(`table.calendar tbody tr td:nth-child(${weekday+1}):not(.prevMonth)`);
        day.querySelector("button.btnCreateSchedule").click();
        await sleep(3000);

        const scheduleName = document.querySelector('input._scheduleName');
        scheduleName.value = '정기대관';
        
        //시간선택
        if(weekday==0){
            document.querySelector('.btnDropDownItem[data-time="오후 10:30"]').click();
        } else{
            document.querySelector('.btnDropDownItem[data-time="오후 10:00"]').click();
        }

        const btnSelectCalendar = Array.from(document.querySelectorAll('button.btnSelectCalendar')).find(button => button.querySelector('.calendarName')?.textContent.trim() === '정기대관');
        btnSelectCalendar.click();
        await sleep(250);

        console.log("First, select members");
        console.log("Then, Set recurrence type set to week");
        while (document.querySelector('select._recurrenceType').value != 'WEEK') {
            await sleep(250);
        }
        await sleep(500);

        const datePicker = document.querySelector("#wrap > div.layerContainerView > div > section > div > div.modalBody.-positionR > div > div.checkBottom._belowCalendarCategoryArea > div.notiRepeat > div:nth-child(1) > div.flexList.-tbSpaceNone.gMat5._untilWrap > div.etc._untilRegion > div");
        datePicker.firstChild.click();
        await sleep(250);

        while (document.querySelector(".datePickerRegion > div > div > div > .monthTxt").innerText.split(' ')[1].slice(0, -1) != MONTH) {
            document.querySelector("button.btnNextMonth._nextMonthButton").click();
            await sleep(250);
        }
        document.querySelector(`td._td:not(.prevMonth) a[data-day="${LASTDAY[MONTH-1]}"]`).click();
        await sleep(250);
        
        const rsvpCheckbox = document.querySelector('input.checkInput._rsvpRequested');
        rsvpCheckbox.click();
        document.querySelector('#rsvp-maybe-enabled').click();

        console.log("Set rsvpDeadline to 5 hours before the event");
        while (document.querySelector('select._selectDeadlineOption').value != 'custom' || document.querySelector('select._selectAmount').value != '5' || document.querySelector('select._selectDurationType').value != 'hour') {
            await sleep(250);
        }
        await sleep(500);

        const announceableCheckbox = document.querySelector("input._announceableCheckbox.checkInput");
        announceableCheckbox.click();
        await sleep(250);

        assert(announceableCheckbox.checked == false, "");
        const btnSubmit = document.querySelector('button.uButton.-confirm._btnSubmit');
        btnSubmit.click();
        await sleep(1000);
    }
    await createSchedule(0);
    await createSchedule(2); 

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
                    
                    const btnMoreOptions = document.querySelector('button.postSet._moreButton');
                    btnMoreOptions.click();
                    await sleep(250);

                    const btnWritePost = document.querySelector('button._optionMenuLink[data-menu-id="WRITE_POST"]');
                    btnWritePost.click();
                    await sleep(750);

                    const payload = document.querySelector("#wrap > div.layerContainerView > div:nth-child(2) > div > section > div > div > div > div.postWriteForm._postWriteForm.-standby > div > p:nth-child(1)");
                    
                    if(is_today){
                        payload.innerText = `오늘 대관투표는 17:${(30-15*weekday).toString().padStart(2, '0')} 까지입니다` + payload.innerText;
                    } else{
                        payload.innerText = `내일 대관투표는 17:${(30-15*weekday).toString().padStart(2, '0')} 까지입니다` + payload.innerText;
                    }

                    const btnWriteSettings = document.querySelector('.btnSetting._btnWriteSetting');
                    btnWriteSettings.click();
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

                    const btnComplete = document.querySelector('button.uButton.-confirm._btnComplete');
                    btnComplete.click();
                    await sleep(250);

                    const btnSubmitPost = document.querySelector('button.uButton.-sizeM.-confirm._btnSubmitPost');
                    btnSubmitPost.click();
                    await sleep(500);
                    await (async function handleAlert() {
                        const skipButton = document.querySelector('section[data-viewname="DAlertModalView"] > div > div.modalFooter > button')
                        if (skipButton) {
                            skipButton.click();
                            await sleep(60000); // sleep for 1 minute
                            const btnSubmitPost = document.querySelector('button.uButton.-sizeM.-confirm._btnSubmitPost');
                            btnSubmitPost.click();
                            await sleep(500);
                        } 
                    })();
                    
                }
                await create(true);  
                await create(false);  
                
            }
        }
    }

    console.log("Done!");
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

