/* eslint-disable no-nested-ternary */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Form, Input, Button, Select, Upload, Switch, Icon, notification } from 'antd'
import { connect } from 'react-redux'
import $ from 'jquery'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { Helmet } from 'react-helmet'
import styles from './style.module.scss'

const { Option } = Select

const FormItem = Form.Item
const { Dragger } = Upload

@Form.create()
@connect(({ lecture, router }) => ({ lecture, router }))
class AddLecture extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      files: [],
      editorState: EditorState.createEmpty(),
      editinglecture: '',
      editedBody: '',
      language: true,
    }
  }

  componentDidMount() {
    const { router, dispatch } = this.props
    const { location } = router
    const uuid = location.state
    if (uuid !== undefined) {
      const body = {
        uuid,
      }
      dispatch({
        type: 'lecture/GET_LECTURE_BY_ID',
        payload: body,
      })
    }
    dispatch({
      type: 'lecture/GET_TOPICS',
    })
    dispatch({
      type: 'lecture/GET_EVENTS',
    })
    dispatch({
      type: 'lecture/GET_LOCATIONS',
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lecture.editLecture !== '') {
      const { lecture } = nextProps
      this.setState({
        editinglecture: lecture.editLecture,
      })
    }
  }

  componentWillUnmount() {
    this.setState({
      editinglecture: '',
    })
  }

  uuidv4 = () => {
    // eslint-disable-next-line func-names
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      // eslint-disable-next-line no-bitwise
      const r = (Math.random() * 16) | 0

      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  handleLanguage = checked => {
    this.setState({
      language: checked,
    })
  }

  handleFormBody = e => {
    e.preventDefault()
    const { form, dispatch, router, english } = this.props
    const { files, editorState, editinglecture } = this.state
    const { location } = router
    const uuid = location.state
    const title = form.getFieldValue('title')
    const tag = form.getFieldValue('tag')
    const language = form.getFieldValue('language')
    const bodylecture = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    const author = form.getFieldValue('author')
    const locationlecture = form.getFieldValue('location')
    const event = form.getFieldValue('event')
    const topic = form.getFieldValue('topic')
    const parts = form.getFieldValue('parts')
    const chapter = form.getFieldValue('chapter')
    const verse = form.getFieldValue('verse')

    const body = {
      uuid: uuid || this.uuidv4(),
      parts,
      verse,
      chapter,
      author,
      tags: tag,
      counters: {
        ru_summary_view: 0,
        ru_transcription_view: 0,
        en_summary_view: 0,
        en_transcription_view: 0,
        video_page_view: 0,
        downloads: 0,
        audio_play_count: 0,
        audio_page_view: 0,
      },
      en: {
        location: locationlecture,
        topic,
        event,
        title,
        summary: {
          attachment_link: '',
          attachment_name: '',
          text: '',
        },
        transcription: {
          attachment_name: '',
          text: '',
        },
      },
      ru: {
        location: locationlecture,
        topic,
        event,
        title,
        summary: {
          attachment_link: '',
          attachment_name: '',
          text: '',
        },
        transcription: {
          attachment_name: '',
          text: '',
        },
      },
    }
    if (editinglecture !== '') {
      const payload = {
        body,
        uuid,
      }
      dispatch({
        type: 'lecture/UPDATE_LECTURE',
        payload,
      })
    } else {
      dispatch({
        type: 'lecture/CREATE_LECTURE',
        body,
      })
    }
  }

  onEditorStateChange: Function = editorState => {
    this.setState({
      editorState,
    })
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  handleFileChange = info => {
    if (info.file.status === 'done') {
      this.uploads3(info.file)
    }
  }

  uploads3 = file => {
    const fileName = file.name
    const fileType = file.type
    $.ajax({
      type: 'GET',
      url: `http://localhost:3000/api/blog/generateUploadUrl?name=folder1/${fileName}&type=${fileType}`,
      success: data => {
        const temp = data.presignedUrl.toString()
        const finalUrl = temp.substr(0, temp.lastIndexOf('?'))
        const { files } = this.state
        const array = [...files]

        array.push(finalUrl)
        this.setState({ files: array })
        this.uploadFileToS3UsingPresignedUrl(data.presignedUrl, file)
      },
      error() {
        notification.error({
          message: 'shalu',
          description: 'Error occured during uploading, Please try again',
        })
      },
    })
  }

  uploadFileToS3UsingPresignedUrl = (presignedUrl, file) => {
    $.ajax({
      type: 'PUT',
      url: presignedUrl,
      data: file.originFileObj,
      headers: {
        'Content-Type': file.type,
        reportProgress: true,
      },
      processData: false,
      success: data => {
        notification.success({
          message: 'Success',
          description: 'file has been uploaded successfully',
        })
      },
      error() {
        notification.warning({
          message: 'error',
          description: 'Error occured during uploading, Please try again',
        })
      },
    })
  }

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  deleteFile = item => {
    const fileName = item.substr(item.lastIndexOf('.com/') + 5)
    $.ajax({
      type: 'GET',
      url: `http://localhost:3000/api/blog/deleteFile/?filename=${fileName}`,
      success: data => {
        notification.success({
          message: 'File Deleted',
          description: 'File has been successfully deleted',
        })

        const { files } = this.state

        for (let i = 0; i < files.length; i += 1) {
          if (files[i] === item) {
            files.splice(i, 1)
            break
          }
        }

        this.setState({
          files,
        })
      },
      error() {
        notification.error({
          message: 'error',
          description: 'Error occured during uploading, Please try again',
        })
      },
    })
  }

  handleReset = () => {
    const { form } = this.props
    form.resetFields()
    this.setState({
      editorState: '',
      editinglecture: '',
    })
  }

  render() {
    const { form, english, lecture } = this.props
    const { topics, events, locations } = lecture
    const { editinglecture, editedBody, editorState, language, files } = this.state
    return (
      <div>
        <Helmet title="Add Blog Post" />
        <section className="card">
          <div className="card-header mb-2">
            <div className="utils__title">
              <strong>Lecture Add/Edit</strong>
              <Switch
                defaultChecked
                checkedChildren={language ? 'en' : 'ru'}
                unCheckedChildren={language ? 'en' : 'ru'}
                onChange={this.handleLanguage}
                className="toggle"
                style={{ width: '100px', marginLeft: '10px' }}
              />
            </div>
          </div>
          <div className="card-body">
            <div className={styles.addPost}>
              <Form className="mt-3">
                <div className="form-group">
                  <FormItem label={language ? 'Title_En' : 'Title_Ru'}>
                    {form.getFieldDecorator('title', {
                      initialValue:
                        editinglecture && editinglecture.en && editinglecture.ru
                          ? language
                            ? editinglecture.en.title
                            : editinglecture.ru.title
                          : '',
                    })(<Input placeholder="Post title" />)}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="Author">
                    {form.getFieldDecorator('author', {
                      initialValue: editinglecture ? editinglecture.author : '',
                    })(
                      <Select
                        id="product-edit-colors"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Author"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="english">Niranjana Swami</Option>
                        <Option value="russian">Other</Option>
                      </Select>,
                    )}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="Language">
                    {form.getFieldDecorator('language', {
                      initialValue: editinglecture ? editinglecture.language : '',
                    })(
                      <Select
                        id="product-edit-colors"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select a color"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="english">English</Option>
                        <Option value="russian">Russian</Option>
                      </Select>,
                    )}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label={language ? 'Location_En' : 'Location_Ru'}>
                    {form.getFieldDecorator('location', {
                      initialValue:
                        editinglecture && editinglecture.en && editinglecture.ru
                          ? language
                            ? editinglecture.en.location
                            : editinglecture.ru.location
                          : '',
                    })(
                      <Select
                        id="product-edit-colors"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Location"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {locations && locations.length > 0
                          ? locations.map(item => {
                              return (
                                <Option key={item._id} value={item.title}>
                                  {item.title}
                                </Option>
                              )
                            })
                          : null}
                      </Select>,
                    )}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label={language ? 'Event_En' : 'Event_Ru'}>
                    {form.getFieldDecorator('event', {
                      initialValue:
                        editinglecture && editinglecture.en && editinglecture.ru
                          ? language
                            ? editinglecture.en.event
                            : editinglecture.ru.event
                          : '',
                    })(
                      <Select
                        id="product-edit-colors"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Event"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {events && events.length > 0
                          ? events.map(item => {
                              return (
                                <Option key={item._id} value={item.title}>
                                  {item.title}
                                </Option>
                              )
                            })
                          : null}
                      </Select>,
                    )}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label={language ? 'Topic_En' : 'Topic_Ru'}>
                    {form.getFieldDecorator('topic', {
                      initialValue:
                        editinglecture && editinglecture.en && editinglecture.ru
                          ? language
                            ? editinglecture.en.topic
                            : editinglecture.ru.topic
                          : '',
                    })(
                      <Select
                        id="product-edit-colors"
                        showSearch
                        style={{ width: '100%' }}
                        placeholder="Select Topic"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {topics && topics.length > 0
                          ? topics.map(item => {
                              return (
                                <Option key={item._id} value={item.title}>
                                  {item.title}
                                </Option>
                              )
                            })
                          : null}
                      </Select>,
                    )}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="part">
                    {form.getFieldDecorator('parts', {
                      initialValue: editinglecture ? editinglecture.parts : '',
                    })(<Input placeholder="parts/songs" />)}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="chapter">
                    {form.getFieldDecorator('chapter', {
                      initialValue: editinglecture ? editinglecture.chapter : '',
                    })(<Input placeholder="Chapter" />)}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label="varse">
                    {form.getFieldDecorator('verse', {
                      initialValue: editinglecture ? editinglecture.verse : '',
                    })(<Input placeholder="Verse/Text" />)}
                  </FormItem>
                </div>
                <div className="form-group">
                  <FormItem label={language ? 'Body_En' : 'Body_Ru'}>
                    {form.getFieldDecorator('content', {
                      initialValue: editorState || '',
                    })(
                      <div className={styles.editor}>
                        <Editor
                          editorState={editorState}
                          onEditorStateChange={this.onEditorStateChange}
                        />
                      </div>,
                    )}
                  </FormItem>
                </div>
                <div className="form-group">
                  <ul>
                    {files && files.length > 0
                      ? files.map(item => {
                          return (
                            <li className="filesList">
                              {item}{' '}
                              <i
                                className="fa fa-close closeIcon"
                                onClick={() => {
                                  this.deleteFile(item)
                                }}
                              />
                            </li>
                          )
                        })
                      : null}
                  </ul>
                </div>
                <div className="form-group">
                  <FormItem>
                    {form.getFieldDecorator('Files')(
                      <Dragger
                        showUploadList={false}
                        customRequest={this.dummyRequest}
                        onChange={this.handleFileChange}
                      >
                        <p className="ant-upload-drag-icon">
                          <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                          Support for a single or bulk upload. Strictly prohibit from uploading
                          company data or other band files
                        </p>
                      </Dragger>,
                    )}
                  </FormItem>
                </div>
                <FormItem>
                  <div className={styles.submit}>
                    <span className="mr-3">
                      <Button type="primary" onClick={this.handleFormBody}>
                        Save and Post
                      </Button>
                    </span>
                    <Button type="danger" onClick={this.handleReset}>
                      Discard
                    </Button>
                  </div>
                </FormItem>
              </Form>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default AddLecture