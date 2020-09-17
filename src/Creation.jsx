import React, { useState, useEffect } from 'react'
import {
  ButtonToolbar,
  Button,
  SelectPicker,
  Icon,
  IconButton,
  Uploader,
  Tooltip,
  Whisper,
  Loader
} from 'rsuite'
import Cookie from 'js-cookie'

import { AddVehicle } from '../../../../../api'

import InputControl from '../utils/InputControl.jsx'

import upload from '../../assets/uploadingImg.svg'
import car from '../../assets/coveredCar.svg'
import personal from '../../assets/personal.svg'
import ambassador from '../../assets/ambassador.svg'
import diplomacy from '../../assets/diplomacy.svg'
import foreign from '../../assets/foreign.svg'
import legal from '../../assets/legal.svg'
import mid from '../../assets/mid.svg'
import minister from '../../assets/minister.svg'

import './Creation.scss'

const Creation = ({ handleAddVehicle, onAddVehicle }) => {
  const [brands, setBrands] = useState([])
  const [models, setModels] = useState([])
  const [position, setPosition] = useState([])
  const [year, setYear] = useState([])
  const [color, setColor] = useState([])
  const [fuel, setFuel] = useState([])
  const [imageNumberType, setImageNumberType] = useState([])
  const [icn, setIcon] = useState('')
  const [arr, setArr] = useState([])
  const [form, setForm] = useState({
    brand: '',
    model: '',
    position: '',
    year: 0,
    color: '',
    fuel: '',
    number: '',
    number_type: '',
    technical_passport_number: '',
    name: '',
    user: Cookie.get('userId')
  })
  const [loading, setLoading] = useState(false)
  const [modelImage, setModelImage] = useState('')
  const [techPassPhotos, setTechPassPhotos] = useState([])
  const [techPassPreviews, setTechPassPreviews] = useState([])
  const [carPhoto, setCarPhoto] = useState([])
  const [carPhotoPreview, setCarPhotoPreview] = useState([])
  const [activeCarPhoto, setActiveCarPhoto] = useState(-1)

  const generatePhotoPreviews = async (previews) => {
    const previewsArray = []

    if (previews.length > 0) {
      for (let i = 0; i < previews.length; i++) {
        await new Promise((resolve) => {
          const reader = new FileReader()
          reader.readAsDataURL(previews[i].blobFile)
          reader.onloadend = () => {
            previewsArray.push(reader.result)
            resolve()
          }
        })
      }
    }

    return previewsArray
  }

  useEffect(() => {
    ;(async () =>
      setTechPassPreviews([...(await generatePhotoPreviews(techPassPhotos))]))()
  }, [techPassPhotos])

  useEffect(() => {
    ;(async () => {
      if (!~activeCarPhoto && carPhoto.length > 0) {
        setActiveCarPhoto(0)
      } else if (carPhoto.length < 1) {
        setActiveCarPhoto(-1)
      }

      setCarPhotoPreview([...(await generatePhotoPreviews(carPhoto))])
    })()
  }, [carPhoto])

  const handleSelectedBrand = (value, item) => {
    setIcon(item.icon)
    setForm((prevState) => ({
      ...prevState,
      brand: item.id
    }))
  }
  const handleOpenBrands = () => {
    handleUpdateBrands()
  }
  const handleUpdateBrands = () => {
    const remapper = (data) =>
      data.flatMap(({ name, icon, id }) => [
        {
          'label': name,
          'value': name,
          'icon': icon,
          'id': id
        }
      ])

    AddVehicle.brandAll()
      .then(({ data }) => {
        setBrands(remapper(data.brands))
      })
      .catch((e) => console.log(e))
  }
  const handleCleanBrands = () => {
    setIcon('')
    setForm((prevState) => ({
      ...prevState,
      brand: ''
    }))
  }

  const handleSelectedModels = (value, item) => {
    const remapper = (data) =>
      data.flatMap((item) => [
        {
          'label': item,
          'value': item
        }
      ])
    setForm((prevState) => ({
      ...prevState,
      model: item.id
    }))
    setLoading(true)
    AddVehicle.getModelImage(item.id)
      .then(({ data: { images } }) => {
        if (images.length === 0) return
        images.length === 1
          ? setModelImage(images[0].image)
          : setModelImage(images[1].image)
        console.log(images)
      })
      .catch((err) => err.response)
      .finally(() => setLoading(false))
    setPosition(remapper(item.position))
  }
  const handleOpenModels = () => {
    handleUpdateModels()
  }
  const handleUpdateModels = () => {
    if (form.brand === '') return
    const remapper = (data) =>
      data.flatMap(({ name, id, positions, brand, years }) => [
        {
          'label': name,
          'value': name,
          'id': id,
          'brand': brand,
          'position': positions,
          'years': years
        }
      ])
    AddVehicle.modelsByBrandAll(form.brand)
      .then(({ data }) => {
        setModels(remapper(data.models))
      })
      .catch((e) => console.log(e))
  }
  const handleCLeanModels = () => {
    setForm((prevState) => ({
      ...prevState,
      model: ''
    }))
  }

  const handleSelectedPositions = (value, item) => {
    setForm((prevState) => ({
      ...prevState,
      position: item.label
    }))
  }
  const handleCleanPositions = () => {
    setForm((prevState) => ({
      ...prevState,
      position: ''
    }))
  }

  const createYears = () => {
    return function closureYear(year = []) {
      for (let i = 1900; i <= new Date().getFullYear(); i++) {
        year.push({
          'label': i,
          'value': i
        })
      }
      return year
    }
  }
  const handleSelectedYears = (value) => {
    setForm((prevState) => ({
      ...prevState,
      year_of_issue: value
    }))
  }
  const handleCleanYears = () => {
    setForm((prevState) => ({
      ...prevState,
      year_of_issue: ''
    }))
  }

  const handleOpenColors = () => {
    handleUpdateColors()
  }
  const handleUpdateColors = () => {
    const remapper = (data) =>
      data.flatMap(({ id, name, hex }) => [
        {
          'label': name,
          'value': name,
          'id': id,
          'hex': hex
        }
      ])
    AddVehicle.colorAll()
      .then(({ data }) => {
        setColor(remapper(data))
      })
      .catch((e) => console.log(e))
  }
  const handleSelectedColors = (value, item) => {
    setForm((prevState) => ({
      ...prevState,
      color: item.hex
    }))
  }
  const handleCleanColors = () => {
    setForm((prevState) => ({
      ...prevState,
      color: ''
    }))
  }

  const createFuel = () => {
    return function closureFuel(fuel) {
      return (fuel = [
        {
          label: 'Бензин',
          value: 'PETROL'
        },
        {
          label: 'Пропан',
          value: 'GAS_PROPANE'
        },
        {
          label: 'Метан',
          value: 'GAS_METHANE'
        },
        {
          label: 'Керосин',
          value: 'KEROSENE'
        },
        {
          label: 'Другое',
          value: 'OTHER'
        }
      ])
    }
  }
  const handleSelectedFuel = (value, item) => {
    setForm((prevState) => ({
      ...prevState,
      fuel: item.value
    }))
  }
  const handleCleanFuel = () => {
    setForm((prevState) => ({
      ...prevState,
      fuel: ''
    }))
  }

  const createImageNumberType = () => {
    return function closureNumberType(image) {
      return (image = [
        {
          label: 'Частный',
          value: 'PRIVATE',
          img: personal
        },
        {
          label: 'Дипломат',
          value: 'DIPLOMAT',
          img: diplomacy
        },
        {
          label: 'Мид',
          value: 'MID',
          img: mid
        },
        {
          label: 'Посол',
          value: 'AMBASSADOR',
          img: ambassador
        },
        {
          label: 'Министер',
          value: 'MINISTER',
          img: minister
        },
        {
          label: 'Юридический',
          value: 'LEGAL',
          img: legal
        },
        {
          label: 'Иностранец',
          value: 'ANOTHER',
          img: foreign
        }
      ])
    }
  }
  const handleSelectedNumberType = (action) => {
    setForm((prevState) => ({
      ...prevState,
      number_type: action
    }))
  }
  const handleCleanNumberType = () => {
    setForm((prevState) => ({
      ...prevState,
      number_type: ''
    }))
  }

  const handleNumberInput = (input) => {
    if (form.number_type === '') return

    setArr(Object.values(input).join(''))
    setForm((prevState) => ({
      ...prevState,
      number: arr
    }))
  }

  useEffect(() => {
    setArr((prev) => (prev = []))
    return () => {
      setArr([])
    }
  }, [form.number_type])

  const handleTechNumberInput = (input) => {
    setForm((prevState) => ({
      ...prevState,
      technical_passport_number: input.number
    }))
  }

  const handleCarNameInput = (input) => {
    setForm((prevState) => ({
      ...prevState,
      name: input.name
    }))
  }

  const handleEndingCreation = () => {
    setLoading(false)
    handleAddVehicle(false)
  }
  const handleForm = () => {
    setLoading(true)
    AddVehicle.createCar(form)
      .then(({ data }) => {
        let fileData = new FormData()
        if (techPassPhotos.length > 1) {
          console.log('here')
          techPassPhotos.map(({ blobFile }) =>
            fileData.append('technical_passport_photos', blobFile)
          )
          AddVehicle.uploadTechPassPhoto(data.id, fileData).then(() => {})
        }
        if (carPhoto.lenght > 1) {
          console.log('here')
          const tempCarPhoto = [...carPhoto]
          const mainPhoto = tempCarPhoto[activeCarPhoto]
          tempCarPhoto.splice(activeCarPhoto, 1)
          tempCarPhoto.map(({ blobFile }) =>
            fileData.append('car_photos', blobFile)
          )
          fileData.append('main_photo', mainPhoto.blobFile)
          console.log(fileData)
          AddVehicle.uploadCarPhoto(data.id, fileData).then((response) => {
            console.log(response)
          })
        }
        onAddVehicle(data)
      })
      .catch((err) => err.response)
  }

  const handlePhotoTechNumber = (value) => {
    setTechPassPhotos(value)
  }

  const handlePhotoCar = (value) => {
    setCarPhoto(value)
  }

  useEffect(() => {
    const years = createYears()
    const fuels = createFuel()
    const numberType = createImageNumberType()
    setFuel(fuels())
    setYear(years().reverse())
    setImageNumberType(numberType())
  }, [])

  const onTechPassPhotoDelete = (idx) => {
    const tempTechPassPhotos = [...techPassPhotos]
    tempTechPassPhotos.splice(idx, 1)
    setTechPassPhotos(tempTechPassPhotos)
  }

  const onCarPhotoDelete = (idx) => {
    const tempCarPhoto = [...carPhoto]
    tempCarPhoto.splice(idx, 1)

    if (idx === activeCarPhoto) {
      setActiveCarPhoto(activeCarPhoto - 1)
    }

    setCarPhoto(tempCarPhoto)
  }

  return (
    <div className="V_Container">
      <div className="Creation_Container">
        <div className="back">
          <ButtonToolbar>
            <Button onClick={() => handleAddVehicle(false)}>Назад</Button>
          </ButtonToolbar>
        </div>
        <div className="form">
          {loading ? (
            <div className="loading_car_Img">
              <Loader size="md" />
            </div>
          ) : (
            <div className="car_Img">
              <img
                src={
                  !~activeCarPhoto
                    ? !modelImage
                      ? car
                      : modelImage
                    : carPhotoPreview[activeCarPhoto]
                }
                alt="car"
                style={
                  form.color !== ''
                    ? { backgroundColor: `${form.color}` }
                    : null
                }
                className={
                  !~activeCarPhoto
                    ? !modelImage
                      ? 'car'
                      : 'standartImg'
                    : 'car active'
                }
              />
              {icn.length !== 0 ? (
                <img src={icn} alt="" className="chevrolet" />
              ) : null}
            </div>
          )}
          <div className="mainForm">
            <div className="itemSelect">
              <SelectPicker
                searchable
                data={brands}
                placeholder="Марка"
                onSelect={(active, item) => handleSelectedBrand(active, item)}
                onOpen={() => handleOpenBrands()}
                onClean={() => handleCleanBrands()}
                renderValue={(value, item) => {
                  return (
                    <div
                      style={{
                        display: 'flex',
                        alignContent: 'center',
                        justifyContent: 'flex-start',
                        color: 'white'
                      }}
                    >
                      <span>
                        <img src={item.icon} alt="logo" width="20px" />
                      </span>{' '}
                      <p
                        style={{
                          color: 'white',
                          lineHeight: 1.5,
                          paddingLeft: 6
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  )
                }}
                renderMenuItem={(label, item) => {
                  return (
                    <div>
                      <img
                        src={item.icon}
                        alt="logo"
                        width="20px"
                        style={{ padding: `2px` }}
                      />{' '}
                      {item.label}
                    </div>
                  )
                }}
                renderMenu={(menu) => {
                  if (brands?.length === 0) {
                    return (
                      <p
                        style={{
                          padding: 4,
                          color: '#999',
                          textAlign: 'center'
                        }}
                      >
                        <Icon icon="spinner" spin /> Загрузка
                      </p>
                    )
                  }
                  return menu
                }}
              />
              <SelectPicker
                searchable
                data={models}
                onOpen={() => handleOpenModels()}
                placeholder="Модель"
                onClean={() => handleCLeanModels()}
                onSelect={(active, item) => handleSelectedModels(active, item)}
                renderMenu={(menu) => {
                  if (models?.length === 0) {
                    return (
                      <p
                        style={{
                          padding: 4,
                          color: '#999',
                          textAlign: 'center'
                        }}
                      >
                        <Icon icon="spinner" spin /> Загрузка
                      </p>
                    )
                  }

                  return menu
                }}
              />
            </div>
            <div className="itemSelect">
              <SelectPicker
                searchable
                data={position}
                placeholder="Позиция"
                onSelect={(active, item) =>
                  handleSelectedPositions(active, item)
                }
                onClean={() => handleCleanPositions()}
              />
              <SelectPicker
                searchable
                data={year}
                placeholder="Год"
                onSelect={(active) => handleSelectedYears(active)}
                onClean={() => handleCleanYears()}
              />
            </div>
            <div className="itemSelect">
              <SelectPicker
                searchable
                data={color}
                menuClassName="custom"
                placeholder="Цвет"
                onOpen={() => handleOpenColors()}
                onSelect={(active, item) => handleSelectedColors(active, item)}
                onClean={() => handleCleanColors()}
                renderMenu={(menu) => {
                  if (color?.length === 0) {
                    return (
                      <p
                        style={{
                          padding: 4,
                          color: '#999',
                          textAlign: 'center'
                        }}
                      >
                        <Icon icon="spinner" spin /> Загрузка
                      </p>
                    )
                  }
                  return menu
                }}
                renderMenuItem={(value, item) => {
                  return (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flexStart',
                        alignItems: 'center',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: item.hex,
                          width: '30px',
                          height: '15px',
                          borderRadius: '6px',
                          border: 'white 1px solid',
                          marginRight: '5px'
                        }}
                      ></div>{' '}
                      {value}
                    </div>
                  )
                }}
              />
              <SelectPicker
                data={fuel}
                searchable
                placeholder="Топливо"
                onSelect={(active, item) => handleSelectedFuel(active, item)}
                onClean={() => handleCleanFuel()}
              />
            </div>
          </div>
          <div className="privateForm">
            <SelectPicker
              placeholder="Номерной знак"
              onSelect={(active) => handleSelectedNumberType(active)}
              onClean={() => handleCleanNumberType()}
              data={imageNumberType}
              placement={'topStart'}
              renderMenuItem={(label, item) => {
                return (
                  <div className="numberType">
                    <img src={item.img} alt="logo" /> {item.label}
                  </div>
                )
              }}
            />

            {form.number_type !== '' ? (
              <InputControl
                control={form.number_type}
                setNumber={handleNumberInput}
              />
            ) : (
              <Whisper
                placement="rigthBottom"
                trigger="active"
                speaker={<Tooltip>Выберите сперва номерной знак</Tooltip>}
              >
                <InputControl
                  control={'PRIVATE'}
                  setNumber={handleNumberInput}
                />
              </Whisper>
            )}
          </div>
          <div className="sign">
            <InputControl
              control={'TECH_NUMBER'}
              setTechInput={handleTechNumberInput}
            />
            <Uploader
              draggable
              autoUpload={false}
              fileListVisible={false}
              multiple={true}
              style={{ height: 40 }}
              fileList={techPassPhotos}
              onChange={handlePhotoTechNumber}
            >
              <div>
                <img src={upload} alt="img" /> фото техпаспорта
              </div>
            </Uploader>
          </div>
          {techPassPreviews.length > 0 && (
            <div className="sign photoPreviewContainer">
              {techPassPreviews.map((photoUrl, idx) => (
                <div className="previewItem" key={idx}>
                  <img src={photoUrl} className="itemImage" />
                  <IconButton
                    size="xs"
                    icon={<Icon icon="close" />}
                    color="red"
                    className="itemDeleteBtn"
                    onClick={() => onTechPassPhotoDelete(idx)}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="carName">
            <InputControl
              control={'CAR_NAME'}
              setCarInput={handleCarNameInput}
            />
          </div>
          <div className="uploader ">
            <Uploader
              draggable
              autoUpload={false}
              fileListVisible={false}
              multiple={true}
              style={{ height: 40 }}
              fileList={carPhoto}
              onChange={handlePhotoCar}
            >
              <div>
                <img src={upload} alt="img" />
                фото автомобиля
              </div>
            </Uploader>
          </div>
          {carPhotoPreview.length > 0 && (
            <div className="sign photoPreviewContainer">
              {carPhotoPreview.map((photoUrl, idx) => (
                <div className="previewItem previewCar" key={idx}>
                  <span
                    onClick={() =>
                      activeCarPhoto !== idx && setActiveCarPhoto(idx)
                    }
                    className={
                      idx === activeCarPhoto
                        ? 'previewIndicator active'
                        : 'previewIndicator'
                    }
                  />
                  <img src={photoUrl} className="itemImage" />
                  <IconButton
                    size="xs"
                    icon={<Icon icon="close" />}
                    color="red"
                    className="itemDeleteBtn"
                    onClick={() => onCarPhotoDelete(idx)}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="save">
            <ButtonToolbar>
              <Button
                onClick={() => handleForm()}
                disabled={form.brand === '' && form.model === '' ? true : false}
              >
                Сохранить
              </Button>
            </ButtonToolbar>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Creation
