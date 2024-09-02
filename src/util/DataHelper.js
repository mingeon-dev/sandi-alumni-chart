import data from './ExcelParser'

export const FIELD_NAME = {
  ID: 'id',
  YEAR_OF_ADMISSION: 'yearOfAdmission',
  MAJOR: 'major',
  DEGREE: 'degree',
  MASTER_UNIVERSITY: 'master.university',
  MASTER_MAJOR: 'master.major',
  MASTER_PROFESSOR: 'master.professor',
  MASTER_CONCENTRATION: 'master.concentration',
  PH_D_UNIVERSITY: 'phD.university',
  PH_D_MAJOR: 'phD.major',
  PH_D_PROFESSOR: 'phD.professor',
  PH_D_CONCENTRATION: 'phD.concentration',
  COMPANY_NAME: 'company.name',
  COMPANY_TEAM: 'company.team',
  COMPANY_TASK: 'company.task',
  COMPANY_TASK_GROUP: 'company.taskGroup',
  COMPANY_PREVIOUS: 'company.previous',
  SUBJECTS: 'subjects'
}

const TITLES = {
  [FIELD_NAME.YEAR_OF_ADMISSION]: '학번',
  [FIELD_NAME.MAJOR]: '학사 전공',
  [FIELD_NAME.DEGREE]: '학위',
  [FIELD_NAME.MASTER_UNIVERSITY]: '석사 대학원',
  [FIELD_NAME.MASTER_MAJOR]: '석사 전공',
  [FIELD_NAME.MASTER_PROFESSOR]: '석사 지도교수',
  [FIELD_NAME.MASTER_CONCENTRATION]: '석사 연구분야',
  [FIELD_NAME.PH_D_UNIVERSITY]: '박사 대학원',
  [FIELD_NAME.PH_D_MAJOR]: '박사 전공',
  [FIELD_NAME.PH_D_PROFESSOR]: '박사 지도교수',
  [FIELD_NAME.PH_D_CONCENTRATION]: '박사 연구분야',
  [FIELD_NAME.COMPANY_NAME]: '회사명',
  [FIELD_NAME.COMPANY_TEAM]: '소속 사업부',
  [FIELD_NAME.COMPANY_TASK]: '담당 업무',
  [FIELD_NAME.COMPANY_TASK_GROUP]: '업무 직군',
  [FIELD_NAME.COMPANY_PREVIOUS]: '이전 근무 이력',
  [FIELD_NAME.SUBJECTS]: '업무 관련 과목'
}

export const getTitle = (key) => TITLES[key] || ''

export const getValue = (item, path) => {
  const keys = path.split('.')
  return keys.reduce((xs, x) => xs?.[x] ?? null, item)
}

export const getDetailByFieldNames = (item, fieldNames) =>
  fieldNames.map((fieldName) => ({
    title: getTitle(fieldName),
    value: getValue(item, fieldName)
  }))

export const getDataByFilter = (path, value) => {
  if (!path) return data
  const keyArray = path.split('.')
  return keyArray.length === 2
    ? data.filter((item) => item[keyArray[0]] && item[keyArray[0]][keyArray[1]]?.includes(value))
    : data.filter((item) => item[keyArray[0]].includes(value))
}

export const calcStatistics = (path) => {
  const keyArray = path.split('.')
  const filteredData =
    keyArray.length === 2 ? data.map((item) => item[keyArray[0]]).filter((item) => item) : data
  const key = keyArray[keyArray.length - 1]
  return filteredData.reduce((accumulator, currentValue) => {
    const values = currentValue[key]?.split(', ') ?? []
    values
      .filter((value) => value !== '')
      .forEach((value) => {
        if (!accumulator[value]) accumulator[value] = 0
        accumulator[value]++
      })
    return accumulator
  }, {})
}

export const getTitleForMobile = (title) =>
  title.replace('관련 ', '관련\n').replace('공학 ', '공학\n')
