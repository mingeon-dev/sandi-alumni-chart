import data from '@/assets/data.json'

export const FIELD_NAME = {
  MAJOR: 'major',
  MASTER: 'master',
  PH_D: 'phD',
  UNIVERSITY: 'university',
  COMPANY: 'company',
  NAME: 'name',
  TASK_GROUP: 'taskGroup',
  YEAR_OF_ADMISSION: 'yearOfAdmission'
}

export const NESTED_FIELD_NAME = {
  MASTER_UNIVERSITY: 'master.university',
  PH_D_UNIVERSITY: 'phD.university',
  COMPANY_NAME: 'company.name',
  COMPANY_TASK_GROUP: 'company.taskGroup'
}

const TITLES = {
  [FIELD_NAME.MAJOR]: '전공',
  [NESTED_FIELD_NAME.MASTER_UNIVERSITY]: '석사 대학원',
  [NESTED_FIELD_NAME.PH_D_UNIVERSITY]: '박사 대학원',
  [NESTED_FIELD_NAME.COMPANY_NAME]: '회사명',
  [NESTED_FIELD_NAME.COMPANY_TASK_GROUP]: '업무 직군',
  [FIELD_NAME.YEAR_OF_ADMISSION]: '학번'
}

export const getTitle = (key) => TITLES[key] || ''

export const getDataByFilter = (path, value) => {
  if (!path) return data
  const keyArray = path.split('.')
  return keyArray.length === 2
    ? data.filter((item) => item[keyArray[0]] && item[keyArray[0]][keyArray[1]].includes(value))
    : data.filter((item) => item[keyArray[0]].includes(value))
}

export const calcStatistics = (path) => {
  const keyArray = path.split('.')
  const filteredData =
    keyArray.length === 2 ? data.map((item) => item[keyArray[0]]).filter((item) => item) : data
  const key = keyArray[keyArray.length - 1]
  return filteredData.reduce((accumulator, currentValue) => {
    const values = currentValue[key].split(', ')
    values.forEach((value) => {
      if (!accumulator[value]) accumulator[value] = 0
      accumulator[value]++
    })
    return accumulator
  }, {})
}
