/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'

// APP HEALTH CHECK ROUTE
Route.get('/health', async ({ response }) => {
  const report = await HealthCheck.getReport()
  return report.healthy ? response.ok(report) : response.badRequest(report)
})


// AUTH ROUTES
Route.post('/api/login', 'UsersController.login')
Route.get('/api/logout', 'UsersController.logout')
Route.post('/api/signup', 'UsersController.signup')

// FORM ROUTES
Route.post('/api/form/:user_id','FormsController.storeById')
Route.get('/api/form/:user_id','FormsController.getById')
Route.delete('/api/form/del/:user_id/:form_id','FormsController.deleteById')
Route.patch('/api/form/edit/:user_id/:form_id','FormsController.editById')

// QUESTION ROUTES
Route.post('/api/question/:form_id','QuestionsController.storeById')
Route.get('/api/question/:form_id','QuestionsController.getById')
Route.delete('/api/question/del/:question_id','QuestionsController.deleteById')
Route.patch('/api/question/edit/:question_id','QuestionsController.editById')

// OPTIONS ROUTES
Route.post('/api/option/:question_id','OptionsController.storeById')
Route.get('/api/option/:question_id','OptionsController.getById')
Route.delete('/api/option/del/:option_id','OptionsController.deleteById')
Route.patch('/api/option/edit/:option_id','OptionsController.editById')