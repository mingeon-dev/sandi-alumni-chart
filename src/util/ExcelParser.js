import { reactive } from 'vue'
import { read, utils } from 'xlsx'

const GOOGLE_DRIVE_FILE_ID = '1eQD-BPRkclS1qRwtQEtxptB0YPuHKKjD'
const DOWNLOAD_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_DRIVE_FILE_ID}/export?format=xlsx`

export const dataState = reactive({
  data: [],
  isLoading: true,
  error: null,
  lastUpdated: null
})

const toIdString = (timestamp) => {
  const date = new Date(timestamp)
  const padByZero = (input) => input.toString().padStart(2, '0')
  const YYYY = padByZero(date.getFullYear())
  const MM = padByZero(date.getMonth() + 1)
  const DD = padByZero(date.getDate())
  const hh = padByZero(date.getHours())
  const mm = padByZero(date.getMinutes())
  const ss = padByZero(date.getSeconds())
  return `${YYYY}${MM}${DD}${hh}${mm}${ss}`
}

const toSubjectArray = (subjectString) => subjectString?.split(', ') ?? []

const formatDateKorean = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}년 ${month}월 ${day}일`
}

const transformData = (raw) =>
  raw
    .map((item) => ({
      id: toIdString(item['타임스탬프']),
      yearOfAdmission: `${item['학번 (예시: 2003)']}`,
      major: item['학사 전공'],
      master: {
        university: item['석사 대학원 (선택)'],
        major: item['석사 전공 (선택)'],
        professor: item['석사 과정 지도교수 (선택)'],
        concentration: item['석사 연구분야 (선택)']
      },
      phD: {
        university: item['박사 대학원 (선택)'],
        major: item['박사 전공 (선택)'],
        professor: item['박사 과정 지도교수 (선택)'],
        concentration: item['박사 연구분야 (선택)']
      },
      company: {
        name: item['현직 회사명'],
        team: item['현직 소속 사업부'],
        task: item['현직 담당 업무'],
        taskGroup: item['현직 업무 직군 선택'],
        previous: item['이전 근무 회사 이력 (선택)']
      },
      subjects: [
        ...new Set([
          ...toSubjectArray(
            item['현직 업무 분야와 관련있는 전자공학 학사 과정 전공기초 과목을 모두 선택 해주세요.']
          ),
          ...toSubjectArray(
            item[
              '현직 업무 분야와 관련있는 컴퓨터공학 학사 과정 전공기초 과목을 모두 선택 해주세요.'
            ]
          ),
          ...toSubjectArray(
            item['현직 업무 분야와 관련있는 전자공학 학사 과정 전공필수 과목을 모두 선택 해주세요.']
          ),
          ...toSubjectArray(
            item[
              '현직 업무 분야와 관련있는 컴퓨터공학 학사 과정 전공필수 과목을 모두 선택 해주세요.'
            ]
          ),
          ...toSubjectArray(
            item['현직 업무 분야와 관련있는 전자공학 학사 과정 전공선택 과목을 모두 선택 해주세요.']
          ),
          ...toSubjectArray(
            item[
              '현직 업무 분야와 관련있는 컴퓨터공학 학사 과정 전공선택 과목을 모두 선택 해주세요.'
            ]
          )
        ])
      ].join(', ')
    }))
    .map((item) => ({
      ...item,
      ...(item.phD?.university
        ? { degree: '박사' }
        : item.master?.university
          ? { degree: '석사' }
          : { degree: '학사' })
    }))

export const loadData = async () => {
  dataState.isLoading = true
  dataState.error = null

  try {
    const response = await fetch(DOWNLOAD_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const workbook = read(arrayBuffer, {
      type: 'array',
      cellDates: true,
      dateNF: 'MM/DD/YYYY THH:mm:ss'
    })

    const raw = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
    dataState.data = transformData(raw)

    const latestTimestamp = Math.max(...raw.map((item) => new Date(item['타임스탬프']).getTime()))
    dataState.lastUpdated = formatDateKorean(new Date(latestTimestamp))
  } catch (error) {
    console.error('Error loading data from Google Drive:', error)
    dataState.error = error.message
  } finally {
    dataState.isLoading = false
  }
}

export default dataState.data
