import React, { useState, useEffect } from 'react'
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  DatePicker,
  Drawer,
  Icon,
  IconButton,
  InputGroup,
  SelectPicker,
  Uploader,
  Loader,
  Dropdown
} from 'rsuite'
import { AssuranceAPI } from '../../../../../../api'
import assurance from '../../../assets/assurance.svg'
import upload from '../../../assets/uploadingImg.svg'
import emptyAssuranceIcon from '../../../assets/emptyRefillIcon.svg'
import { generatePhotoPreviews } from './index.js'

import './index.scss'
import './Assurance.scss'

const data = [
  {
    'label': 'ОСАГО',
    'value': 'OSAGO'
  },
  {
    'label': 'КАСКО',
    'value': 'KASKO'
  },
  {
    'label': 'Другое',
    'value': 'NONE'
  }
]

const Assurance = ({ open, setOpen, car }) => {
  const [isSecondActive, setSecondActive] = useState(false)
  const [assuranceId, setAssuranceId] = useState('')

  const close = () => {
    setAssuranceId('')
    setOpen({ assurance: false })
  }

  const passIdAssurance = (id) => {
    setAssuranceId(id)
  }

  return (
    <Drawer show={open.assurance} placement={'right'} size={'sm'}>
      <div className="header_rs-drawer">
        <div className="title">
          <img src={assurance} alt="assurance" />
          <p>Страховка</p>
        </div>
        <ButtonToolbar>
          <IconButton icon={<Icon icon={'close'} />} onClick={() => close()} />
        </ButtonToolbar>
      </div>
      <div className="mainContent">
        <div className="HB_SideContainerSwitch">
          <ButtonToolbar>
            <ButtonGroup>
              <Button
                active={!isSecondActive}
                disabled={!isSecondActive}
                onClick={() => setSecondActive(false)}
              >
                Напоминания
              </Button>
              <Button
                active={isSecondActive}
                disabled={isSecondActive}
                onClick={() => setSecondActive(true)}
              >
                История
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
        {!isSecondActive ? (
          <AssuranceForm
            carId={car.id}
            assuranceId={assuranceId}
            setSecondActive={setSecondActive}
            passIdAssurance={passIdAssurance}
          />
        ) : (
          <AssuranceHistory
            carId={car.id}
            setSecondActive={setSecondActive}
            passIdAssurance={passIdAssurance}
          />
        )}
      </div>
    </Drawer>
  )
}

const AssuranceForm = ({
  carId,
  assuranceId,
  setSecondActive,
  passIdAssurance
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    car: carId,
    validity: {
      start: '',
      end: ''
    },
    serial_number: {
      number: '',
      serial: ''
    },
    company_name: '',
    insurance_payment: '',
    insurance_price: '',
    drivers: [],
    type: '',
    contact_number: '998'
  })
  const [assurancePhoto, setAssurancePhoto] = useState([])
  const [assurancePhotoPreview, setAssurancePhotoPreview] = useState([])

  useEffect(() => {
    ;(async () =>
      setAssurancePhotoPreview([
        ...(await generatePhotoPreviews(assurancePhoto))
      ]))()
  }, [assurancePhoto])

  useEffect(() => {
    if (assuranceId === '') return
    setIsLoading(true)
    AssuranceAPI.getAssuranceHistoryItem(assuranceId)
      .then(
        ({
          data: {
            car,
            company_name,
            contact_number,
            drivers,
            insurance_payment,
            insurance_price,
            serial_number,
            type,
            validity,
            photos,
            id
          }
        }) => {
          console.log({
            validity,
            photos,
            id
          })
          let tempDrivers = []
          drivers.forEach(({ name }) => tempDrivers.push(name))
          let tempType = data.filter(({ label, value }) => value === type)
          setForm((prev) => ({
            ...prev,
            car: carId,
            validity: {
              start: validity?.start,
              end: validity?.end
            },
            type: tempType[0].value,
            serial_number: {
              serial: serial_number?.serial ? serial_number.serial : '',
              number: serial_number?.number ? serial_number.number : ''
            },
            company_name: company_name ? company_name : '',
            insurance_payment: insurance_payment ? insurance_payment : '',
            insurance_price: insurance_price ? insurance_price : '',
            contact_number: contact_number ? contact_number : '998',
            drivers: tempDrivers
          }))
        }
      )
      .catch((err) => err.response)
      .finally(() => setIsLoading(false))
  }, [assuranceId])

  const onCleanSubmit = () => {
    setForm((prev) => ({
      ...prev,
      car: carId,
      validity: {
        start: '',
        end: ''
      },
      serial_number: {
        number: '',
        serial: ''
      },
      company_name: '',
      insurance_payment: '',
      insurance_price: '',
      drivers: [],
      type: '',
      contact_number: '998'
    }))
    passIdAssurance('')
    setSecondActive(true)
  }

  const onFormChange = ({ target: { name, value } }) => {
    let tempValue = value

    switch (name) {
      case 'number':
        tempValue = tempValue.replace(/\D/g, '')
        setForm((prev) => ({
          ...prev,
          serial_number: {
            number: tempValue,
            serial: form.serial_number.serial
          }
        }))
        break
      case 'insurance_payment':
        tempValue = tempValue.replace(/\D/g, '')
        setForm((prev) => ({
          ...prev,
          insurance_payment: tempValue
        }))
        break
      case 'insurance_price':
        tempValue = tempValue.replace(/\D/g, '')
        setForm((prev) => ({
          ...prev,
          insurance_price: tempValue
        }))
        break
      case 'contact_number':
        tempValue = tempValue.replace(/\D/g, '')
        setForm((prev) => ({
          ...prev,
          contact_number: tempValue
        }))
        break
      case 'serial':
        tempValue = tempValue.toUpperCase()
        setForm((prev) => ({
          ...prev,
          serial_number: {
            number: form.serial_number.number,
            serial: tempValue
          }
        }))
        break
      default:
        setForm((prev) => ({
          ...prev,
          [name]: tempValue
        }))
        break
    }
  }

  const onDriverInputChange = (id, value) => {
    const tempDriversInput = [...form.drivers]
    tempDriversInput[id] = value
    setForm((prev) => ({
      ...prev,
      drivers: tempDriversInput
    }))
  }

  const deleteDriverInput = (idx) => {
    const tempDrivers = [...form.drivers]
    tempDrivers.splice(idx, 1)
    setForm((prev) => ({
      ...prev,
      drivers: tempDrivers
    }))
  }

  const onAddDriverInput = () => {
    const tempDrivers = [...form.drivers]
    tempDrivers.push('')
    setForm((prev) => ({
      ...prev,
      drivers: tempDrivers
    }))
  }

  const handleAssurancePhoto = (value) => {
    setAssurancePhoto(value)
  }

  const onAssurancePhotoDelete = (id) => {
    const tempAssurancePhoto = [...assurancePhoto]
    tempAssurancePhoto.splice(id, 1)
    setAssurancePhoto(tempAssurancePhoto)
  }

  const onStartOk = (date) => {
    let tempDate = date
    if (assuranceId === '') tempDate = tempDate.getTime() / 1000
    else tempDate = tempDate.getTime()
    setForm((prev) => ({
      ...prev,
      validity: {
        start: tempDate,
        end: form.validity.end
      }
    }))
  }

  const onDateStartClean = () => {
    setForm((prev) => ({
      ...prev,
      validity: {
        start: '',
        end: form.validity.end
      }
    }))
  }

  const onEndOk = (date) => {
    let tempDate = date
    if (assuranceId === '') tempDate = tempDate.getTime() / 1000
    else tempDate = tempDate.getTime()

    setForm((prev) => ({
      ...prev,
      validity: {
        start: form.validity.start,
        end: tempDate
      }
    }))
  }
  const onDateEndClean = () => {
    setForm((prev) => ({
      ...prev,
      validity: {
        start: form.validity.start,
        end: ''
      }
    }))
  }

  const onSelectType = (active, item) => {
    setForm((prev) => ({
      ...prev,
      type: active
    }))
  }

  const onSelectClean = () => {
    setForm((prev) => ({
      ...prev,
      type: ''
    }))
  }

  const onLoading = () => {
    setIsLoading(false)
    setSecondActive(true)
  }

  const onSubmit = () => {
    setIsLoading(true)
    let fileData = new FormData()
    if (assuranceId === '') {
      AssuranceAPI.createAssurance(form)
        .then(({ data: { id } }) => {
          if (assurancePhoto.length > 1) {
            assurancePhoto.map(({ blobFile }) =>
              fileData.append('photos', blobFile)
            )
            AssuranceAPI.uploadAssurancePhoto(id, fileData).then()
          }
        })
        .catch((err) => err.response)
        .finally(() => onLoading())
    } else {
      const correctData = {
        car: carId,
        validity: {
          start: form.validity.start / 1000,
          end: form.validity.end / 1000
        },
        serial_number: {
          number: form.serial_number.number,
          serial: form.serial_number.serial
        },
        company_name: form.company_name,
        insurance_payment: form.insurance_payment,
        insurance_price: form.insurance_price,
        drivers: [...form.drivers],
        type: form.type,
        contact_number: form.contact_number
      }

      AssuranceAPI.updateAssuranceHistoryItem(assuranceId, correctData)
        .then(({ data: { id } }) => {
          if (assurancePhoto.length > 1) {
            assurancePhoto.map(({ blobFile }) =>
              fileData.append('photos', blobFile)
            )

            AssuranceAPI.uploadAssurancePhoto(id, fileData).then()
          }
        })
        .catch((err) => err.response)
        .finally(() => onLoading())
    }
  }

  return isLoading ? (
    <div className="HistoryLoader">
      <Loader size="md" />
    </div>
  ) : (
    <div className="assurance">
      <div className="dateRange">
        <p className="text">Срок действия страховки</p>
        {assuranceId !== '' ? (
          <>
            <DatePicker
              placeholder="Начало"
              onOk={(date) => onStartOk(date)}
              cleanable={false}
              value={new Date(form.validity?.start)}
            />
            <DatePicker
              placeholder="Конец"
              placement={'bottomEnd'}
              onOk={(date) => onEndOk(date)}
              cleanable={false}
              value={new Date(form.validity?.end)}
            />
          </>
        ) : (
          <>
            <DatePicker
              placeholder="Начало"
              onOk={(date) => onStartOk(date)}
              onClean={() => onDateStartClean()}
            />
            <DatePicker
              placeholder="Конец"
              placement={'bottomEnd'}
              onOk={(date) => onEndOk(date)}
              onClean={() => onDateEndClean()}
            />
          </>
        )}
      </div>
      <div className="assuranceCompany">
        <input
          className="rs-input company"
          name="company_name"
          maxLength="50"
          placeholder="Страховая компания"
          value={form.company_name}
          onChange={onFormChange}
        />
      </div>
      <div className="assuranceType">
        {assuranceId !== '' ? (
          <SelectPicker
            data={data}
            placeholder="Тип страхования"
            className="type"
            onSelect={(active, item) => onSelectType(active, item)}
            onClean={() => onSelectClean()}
            value={form?.type}
          />
        ) : (
          <SelectPicker
            data={data}
            placeholder="Тип страхования"
            className="type"
            onSelect={(active, item) => onSelectType(active, item)}
            onClean={() => onSelectClean()}
          />
        )}
      </div>
      <div className="assuranceNumber">
        <input
          name="serial"
          className="rs-input"
          placeholder="Серия"
          maxLength="4"
          value={form?.serial_number?.serial}
          onChange={onFormChange}
        />
        <input
          name="number"
          className="rs-input"
          placeholder="Номер"
          autoComplete="off"
          value={form?.serial_number?.number}
          onChange={onFormChange}
          maxLength="7"
        />
      </div>
      <div className="driverList">
        <ButtonToolbar className="addDriver">
          <IconButton
            icon={<Icon icon={'plus'} />}
            onClick={() => onAddDriverInput()}
          >
            Добавить Водителей
          </IconButton>
        </ButtonToolbar>
        {form.drivers?.map((driver, idx) => (
          <React.Fragment key={idx}>
            <InputGroup inside>
              <input
                placeholder="Водитель"
                className="rs-input driver"
                maxLength="25"
                value={driver}
                onChange={({ target: { value } }) =>
                  onDriverInputChange(idx, value)
                }
              />
              <InputGroup.Button onClick={() => deleteDriverInput(idx)}>
                <Icon icon="trash" className="iconTrash" />
              </InputGroup.Button>
            </InputGroup>
          </React.Fragment>
        ))}
      </div>
      <div className="assurancePayment">
        <input
          placeholder="Страховая выплата"
          className="rs-input"
          name="insurance_payment"
          maxLength="7"
          value={form?.insurance_payment}
          onChange={onFormChange}
        />
        <input
          placeholder="Цена"
          className="rs-input"
          name="insurance_price"
          maxLength="7"
          value={form?.insurance_price}
          onChange={onFormChange}
        />
        <input
          placeholder="Контакт"
          className="rs-input"
          name="contact_number"
          maxLength="12"
          value={form?.contact_number}
          onChange={onFormChange}
        />
      </div>
      <div className="assurancePhoto">
        <Uploader
          draggable
          autoUpload={false}
          fileListVisible={false}
          multiple={true}
          style={{ height: 40 }}
          fileList={assurancePhoto}
          onChange={handleAssurancePhoto}
        >
          <div>
            <img src={upload} alt="img" className="imgUploader" />
            фото
          </div>
        </Uploader>
      </div>
      {assurancePhotoPreview.length > 0 && (
        <div className="sign photoPreviewContainer">
          {assurancePhotoPreview.map((photoUrl, idx) => (
            <div className="previewItem" key={idx}>
              <img src={photoUrl} className="itemImage" />
              <IconButton
                size="xs"
                icon={<Icon icon="close" />}
                color="red"
                className="itemDeleteBtn"
                onClick={() => onAssurancePhotoDelete(idx)}
              />
            </div>
          ))}
        </div>
      )}
      {!assuranceId ? (
        <div className="assuranceSubmit">
          <Button
            onClick={onSubmit}
            disabled={
              form.validity.start !== '' && form.validity.end !== ''
                ? false
                : true
            }
          >
            Добавить
          </Button>
        </div>
      ) : (
        <div className="assuranceChange">
          <div className="change">
            <Button
              onClick={onSubmit}
              disabled={
                form.validity.start !== '' && form.validity.end !== ''
                  ? false
                  : true
              }
            >
              Изменить
            </Button>
          </div>
          <div className="cancel">
            <Button
              onClick={() => onCleanSubmit()}
              disabled={
                form.validity.start !== '' && form.validity.end !== ''
                  ? false
                  : true
              }
            >
              Отменить
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
const AssuranceHistory = ({ carId, setSecondActive, passIdAssurance }) => {
  const [historyList, setHirstoryList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    AssuranceAPI.getAssuranceHistory(carId)
      .then(({ data: { insurances } }) => {
        setHirstoryList([...insurances])
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false))
    return () => {
      setHirstoryList([])
      setIsLoading(true)
    }
  }, [])

  const onEditHitsory = (id) => {
    passIdAssurance(id)
    setSecondActive(false)
  }
  const onDeleteHistory = (id) => {
    setIsLoading(true)
    AssuranceAPI.deleteAssuranceHistory(id)
      .then((response) => {
        AssuranceAPI.getAssuranceHistory(carId).then(
          ({ data: { insurances } }) => {
            setHirstoryList([...insurances])
          }
        )
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false))
  }

  return isLoading ? (
    <div className="HistoryLoader">
      <Loader size="md" />
    </div>
  ) : historyList.length < 1 ? (
    <div className="emptyRefillHistory">
      <img src={emptyAssuranceIcon} alt="No items" />
      <p className="infoText">История пуста. Пожалуйста добавьте страховку</p>
      <Button onClick={() => setSecondActive(false)} className="emptyRefillBtn">
        + Добавить
      </Button>
    </div>
  ) : (
    <div className="fuelListContainer">
      <p>Предыдущие страховки</p>
      <ul className="listContainer">
        {historyList.map(({ id, validity, drivers }) => (
          <li className="listItem" key={id}>
            <div className="indicator">
              <span>{new Date(validity.start).getFullYear()}</span>
            </div>
            <div className="itemInfo">
              <span>
                {new Date(validity.start).toLocaleDateString()}—{' '}
                {new Date(validity.end).toLocaleDateString()} сум
              </span>
              <span>{drivers.length} водителя</span>
            </div>
            <Dropdown
              placement="bottomEnd"
              renderTitle={() => {
                return (
                  <IconButton
                    appearance="link"
                    icon={<Icon icon="ellipsis-v" />}
                    circle
                  />
                )
              }}
            >
              <Dropdown.Item onClick={() => onEditHitsory(id)}>
                <Icon icon="edit" /> Изменить
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onDeleteHistory(id)}>
                <Icon icon="trash" />
                Удалить
              </Dropdown.Item>
            </Dropdown>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Assurance
