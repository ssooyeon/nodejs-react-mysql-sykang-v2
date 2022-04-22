import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Alert, Button, FormGroup, InputGroup, Input, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";
import { CirclePicker } from "react-color";
import DatePicker from "react-date-picker";
import DateTimePicker from "react-datetime-picker";

import s from "./Schedule.module.scss";

import { updateSchedule, deleteSchedule } from "../../actions/schedules";

const colorList = [
  "#456C86",
  "#B8A8A2",
  "#546B68",
  "#A2B8A8",
  "#D19C4F",
  "#B89B8F",
  "#7DA0B8",
  "#ea4949",
  "#c3c31f",
  "#1fc31f",
  "#0101c3",
  "#c301c3",
];
const weekList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekAbbr = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const weekOrder = ["1st", "2nd", "3rd", "4th", "5th"];

export default function EditScheduleModal({ open, handleCloseClick, schedule }) {
  const initialScheduleState = {
    id: "",
    title: "",
    description: "",
    start: "",
    end: "",
    backgroundColor: "",
    textColor: "",
    isAllDay: false,
    rrule: "",
    duration: null,
    createrId: "",
  };

  const [scheduleForm, setScheduleForm] = useState(initialScheduleState);
  const [isRepeat, setIsRepeat] = useState(false); // 선택한 스케줄이 반복 일정인지 아닌지의 여부 (체크박스)
  const [repeatDate, setRepeatDate] = useState(""); // 선택한 날짜를 string 포맷으로 추출, select opion 값을 정확하게 binding하기 위함
  const [day, setDay] = useState(""); // 선택한 날짜의 day만 추출
  const [week, setWeek] = useState(""); // 선택한 날짜의 요일만 추출
  const [weekNum, setWeekNum] = useState(""); // 선택한 날짜가 몇 번째 주인지 추출

  const [isShowSuccessAlert, setIsShowSuccessAlert] = useState(false); // 게시글 등록에 성공했는지의 여부
  const [successMessage, setSuccessMessage] = useState(""); // 게시글 등록에 성공했을 때의 메세지

  const [isShowErrAlert, setIsShowErrAlert] = useState(false); // 게시글 등록에 실패했는지의 여부
  const [errMessage, setErrMessage] = useState(""); // 게시글 등록에 실패했을 때의 에러 메시지

  const dispatch = useDispatch();

  useEffect(() => {
    // schedule 로딩이 제대로 이루어졌으면
    if (Object.keys(schedule).length > 0) {
      setExistSchedule(schedule);
    }
    setScheduleForm(schedule);
  }, [schedule]);

  // 선택한 스케줄 기반으로 체크박스, 셀렉트 옵션 등 설정
  const setExistSchedule = (schedule) => {
    // select option 값 설정
    const sdt = new Date(schedule.start);
    updateRepeatOption(sdt);
    // select option 값 안의 string date (INPUT_DATE_STR) 설정
    if (schedule.isAllDay) {
      setRepeatDate(moment(schedule.start).format("YYYYMMDD"));
    } else {
      setRepeatDate(moment(schedule.start).format("YYYYMMDDTHHmmss"));
    }
    // isRepeat 체크박스 설정
    if (schedule.rrule !== null) {
      setIsRepeat(true);
    } else {
      setIsRepeat(false);
    }
  };

  // 날짜 변경 시 반복 일정 select option 업데이트
  const updateRepeatOption = (date) => {
    const day = date.getDate();
    const week = date.getDay();
    let weekNum = Math.ceil((day + 6 - week) / 7);

    // 마지막 주이면 weekNum을 -1로 설정
    let diffDay = new Date(date);
    diffDay.setDate(day + 7);
    if (new Date(diffDay).getMonth() !== date.getMonth()) {
      weekNum = -1;
    }

    setDay(day);
    setWeek(week); // 0: 일요일
    setWeekNum(weekNum);
  };

  // 부모에게 완료사항 전달
  const handleClose = () => {
    handleCloseClick(false);
    setScheduleForm(initialScheduleState);
    setIsShowSuccessAlert(false);
    setIsShowErrAlert(false);
  };

  // input 값 변경 시 scheduleForm state 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm({ ...scheduleForm, [name]: value });
  };
  // all day 체크박스 클릭
  const handleCheckbox = (e) => {
    setScheduleForm({ ...scheduleForm, isAllDay: e.target.checked });
  };
  // repeat 체크박스 클릭
  const handleRepeatCheckbox = (e) => {
    const checked = e.target.checked;
    setIsRepeat(checked);
  };
  // 시작 시간 변경
  const onStartDateChange = (date) => {
    setScheduleForm({ ...scheduleForm, start: date });
  };
  // 종료 시간 변경
  const onEndDateChange = (date) => {
    setScheduleForm({ ...scheduleForm, end: date });
  };
  // repeat rrule 옵션 변경
  const handleRepeatOption = (e) => {
    setScheduleForm({ ...scheduleForm, rrule: e.target.value });
  };
  // 배경 색 변경
  const onBackgroundColorStateChange = (colorState) => {
    setScheduleForm({ ...scheduleForm, backgroundColor: colorState });
  };

  // 스케줄 수정
  const editSchedule = () => {
    let data = scheduleForm;
    let rrule = null;
    let duration = null;
    // 제목이 비어있으면 nonamed로 지정
    if (scheduleForm.title === "") {
      data.title = "nonamed";
    }
    // Repeat 체크박스가 해제되어 있거나 NONE이 선택되어 있으면 rrule = null로 설정
    if (!isRepeat || data.rrule === "") {
      data.rrule = null;
    }

    const start = moment(data.start);
    const end = moment(data.end);
    let dtStart = start; // rrule에 삽입할 dtStart option

    // 날짜 범위 유효성 확인
    if (start > end) {
      setIsShowErrAlert(true);
      setErrMessage("The end time must be later than the start time.");
    } else {
      // all day이면 yyyy-mm-dd를 삽입
      if (scheduleForm.isAllDay) {
        data.start = start.format("YYYY-MM-DD");
        data.end = end.format("YYYY-MM-DD");
        dtStart = start.format("YYYYMMDD");
      } else {
        // all day가 아니면 hh:mm:ss까지 삽입
        data.start = start.format("YYYY-MM-DD HH:mm:ss");
        data.end = end.format("YYYY-MM-DD HH:mm:ss");
        dtStart = start.format("YYYYMMDDTHHmmss");
      }

      // 반복 옵션이 설정되어 있고, 반복 일정 중 매달 O일 옵션 일 경우, 옵션에 O일 명시
      if (isRepeat && data.rrule !== null && data.rrule !== "") {
        // if (isRepeat && data.rrule !== null) {
        let rruleArr = data.rrule.split("\n");
        rrule = "DTSTART:" + dtStart + "\n" + rruleArr[1];
        // duration 설정
        const diffMillisec = Math.abs(end - start);
        const diffHours = diffMillisec / 36e5;
        // 24시간 이상일 경우만 설정 (days:1이 default)
        if (diffHours > 24) {
          duration = diffHours + ":00";
        }
      }
      data = { ...data, rrule: rrule, duration: duration };

      dispatch(updateSchedule(data.id, data))
        .then(() => {
          setIsShowSuccessAlert(true);
          setIsShowErrAlert(false);
          setSuccessMessage("Schedule updated successfully.");
          // todo: create alarm: update schedule in my group (6)
          setTimeout(() => {
            handleClose();
          }, 500);
        })
        .catch((e) => console.log(e));
    }
  };

  // 스케줄 삭제
  const removeSchedule = () => {
    dispatch(deleteSchedule(scheduleForm.id))
      .then(() => {
        handleClose();
      })
      .catch((e) => console.log(e));
  };

  return (
    <Modal isOpen={open} toggle={handleClose} backdrop={false} centered>
      <ModalBody>
        <span className="fw-semi-bold">Edit Schedule</span>
        <h6 className="widget-auth-info">Please fill all fields below.</h6>
        <form onSubmit={editSchedule}>
          {isShowErrAlert ? (
            <Alert className="alert-sm widget-middle-overflow rounded-0" color="danger" style={{ margin: 0 }}>
              {errMessage}
            </Alert>
          ) : null}
          {isShowSuccessAlert ? (
            <Alert className="alert-sm widget-middle-overflow rounded-0" color="success" style={{ margin: 0 }}>
              {successMessage}
            </Alert>
          ) : null}

          <FormGroup className="mt">
            <Label for="title">Title</Label>
            <InputGroup className="input-group-no-border">
              <Input
                id="title"
                className="input-transparent pl-3"
                value={scheduleForm.title}
                onChange={handleInputChange}
                type="text"
                required
                name="title"
                placeholder="Title"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <InputGroup className="input-group-no-border">
              <Input
                id="description"
                className="input-transparent pl-3"
                value={scheduleForm.description}
                onChange={handleInputChange}
                rows={5}
                type="textarea"
                required
                name="description"
                placeholder="Description"
              />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <input type="checkbox" checked={scheduleForm.isAllDay} onChange={(e) => handleCheckbox(e)} />
            <label>&nbsp; All day &nbsp;</label>
          </FormGroup>
          {scheduleForm.isAllDay ? (
            <>
              <FormGroup>
                <div className={s.dateWrapper}>
                  <span className={s.labelText}>Start date</span>
                  <DatePicker
                    locale="en"
                    format="yyyy-MM-dd"
                    dayPlaceholder="dd"
                    monthPlaceholder="MM"
                    yearPlaceholder="yyyy"
                    className={s.scheduleDatePicker}
                    clearIcon={null}
                    onChange={onStartDateChange}
                    value={scheduleForm.start ? new Date(scheduleForm.start) : null}
                  />
                </div>
                &nbsp;&nbsp; &nbsp;&nbsp;
                <div className={s.dateWrapper}>
                  <span className={s.labelText}>End date</span>
                  <DatePicker
                    locale="en"
                    format="yyyy-MM-dd"
                    dayPlaceholder="dd"
                    monthPlaceholder="MM"
                    yearPlaceholder="yyyy"
                    className={s.scheduleDatePicker}
                    clearIcon={null}
                    onChange={onEndDateChange}
                    value={scheduleForm.end ? new Date(scheduleForm.end) : null}
                  />
                </div>
              </FormGroup>
            </>
          ) : (
            <>
              <FormGroup>
                <div className={s.dateWrapper}>
                  <span className={s.labelText}>Start date</span>
                  <DateTimePicker
                    locale="en"
                    format="yyyy-MM-dd HH:mm"
                    minutePlaceholder="mm"
                    hourPlaceholder="hh"
                    dayPlaceholder="dd"
                    monthPlaceholder="MM"
                    yearPlaceholder="yyyy"
                    className={s.scheduleDatePicker}
                    clearIcon={null}
                    onChange={onStartDateChange}
                    value={scheduleForm.start ? new Date(scheduleForm.start) : null}
                  />
                </div>
                &nbsp;&nbsp; &nbsp;&nbsp;
                <div className={s.dateWrapper}>
                  <span className={s.labelText}>End date</span>
                  <DateTimePicker
                    locale="en"
                    format="yyyy-MM-dd HH:mm"
                    minutePlaceholder="mm"
                    hourPlaceholder="hh"
                    dayPlaceholder="dd"
                    monthPlaceholder="MM"
                    yearPlaceholder="yyyy"
                    className={s.scheduleDatePicker}
                    clearIcon={null}
                    onChange={onEndDateChange}
                    value={scheduleForm.end ? new Date(scheduleForm.end) : null}
                  />
                </div>
              </FormGroup>
            </>
          )}
          <FormGroup>
            <input type="checkbox" checked={isRepeat} onChange={(e) => handleRepeatCheckbox(e)} />
            <label>&nbsp; Repeat &nbsp;</label>
          </FormGroup>
          {isRepeat ? (
            <FormGroup>
              <Input
                id="repeatOption"
                className="input-transparent pl-3"
                type="select"
                name="repeatOption"
                value={scheduleForm.rrule || ""}
                onChange={handleRepeatOption}
              >
                <option value="">None</option>
                <option value={`DTSTART:${repeatDate}\nRRULE:FREQ=MONTHLY`}>{`${day} of month`}</option>
                <option value={`DTSTART:${repeatDate}\nRRULE:FREQ=WEEKLY;BYDAY=${weekAbbr[week]}`}>{`Every ${weekList[week]}`}</option>
                {weekNum === -1 ? (
                  <option value={`DTSTART:${repeatDate}\nRRULE:FREQ=MONTHLY;BYDAY=-1${weekAbbr[week]}`}>
                    {`last ${weekList[week]} of every week`}
                  </option>
                ) : (
                  <option value={`DTSTART:${repeatDate}\nRRULE:FREQ=MONTHLY;BYDAY=+${weekNum}${weekAbbr[week]}`}>
                    {`${weekOrder[weekNum - 1]} ${weekList[week]} of every week`}
                  </option>
                )}
              </Input>
            </FormGroup>
          ) : null}
          <FormGroup>
            <Label for="backgroundColor">
              Background Color: &nbsp;
              <div className={s.labelDiv} style={{ background: scheduleForm.backgroundColor ? scheduleForm.backgroundColor : "" }}></div>
            </Label>
            <InputGroup className="input-group-no-border">
              <CirclePicker
                className={s.colorPicker}
                colors={colorList}
                circleSize={25}
                onChangeComplete={(colore) => onBackgroundColorStateChange(colore.hex)}
              />
            </InputGroup>
          </FormGroup>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="default" className="mr-2" size="sm" onClick={removeSchedule} style={{ float: "left" }}>
          Remove
        </Button>
        <Button color="danger" className="mr-2" size="sm" onClick={editSchedule}>
          Edit
        </Button>
        <Button color="inverse" className="mr-2" size="sm" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
