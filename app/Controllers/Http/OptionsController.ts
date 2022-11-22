import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Option from 'App/Models/Option'
import Question from 'App/Models/Question'
export default class OptionsController {
  public async storeById({ params, request, response }: HttpContextContract) {
    const id = params.question_id
    const body = request.body()
    body.question_id = id
    try {
      const option = await Option.create(body)
      const question = await Question.find(id)
      question?.merge({
        options: [...question.options, option.id],
      })
      await question?.save()
      return response.status(201).json({
        success: true,
        data: option,
      })
    } catch (error) {
      return response.status(error?.status || 500).json({
        status: false,
        error: error.message,
      })
    }
  }

  public async getById({ params, response }: HttpContextContract) {
    try {
      const question = await Question.find(params.question_id)
      const options = await Option.findMany([...(question?.options ?? [])])
      return response.json({
        data: options,
        success: true,
      })
    } catch (error) {
      return response.status(error?.status || 500).json({
        status: false,
        error: error.message,
      })
    }
  }

  public async deleteById({ params, response }: HttpContextContract) {
    const id = params.option_id
    try {
      const option = await Option.find(id)
      if (!option) {
        throw new Error('Option not found')
      }
      await option.delete()
      const question = await Question.find(option.question_id)
      question!.merge({
        options: [...question!.options.filter((item) => item !== +id)],
      })
      return response.json({
        success: true,
        message: `Option with id ${option.id} deleted`,
      })
    } catch (error) {
      return response.status(error?.status || 500).json({
        status: false,
        error: error.message,
      })
    }
  }

  public async editById({ params, request, response }: HttpContextContract) {
    const id = params.option_id
    const body = request.body()
    try {
      const option = await Option.find(id)
      if (!option) {
        throw new Error('Option not found')
      }
      option.merge({
        name: body.name,
        visible: body.visible,
        priority: body.priority,
      })
      await option.save()
      return response.json({
        success: true,
        data: option,
      })
    } catch (error) {
      return response.status(error?.status || 500).json({
        status: false,
        error: error.message,
      })
    }
  }
}
