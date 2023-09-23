/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom"
import {fireEvent, screen, waitFor} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from '../__mocks__/localStorage.js'
import userEvent from '@testing-library/user-event'
import Bills from '../containers/Bills.js'
import { ROUTES } from '../constants/routes.js'
import mockedBills from '../__mocks__/store.js'

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then a form should be displayed", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      await waitFor(() => screen.getByTestId('form-new-bill'))
      const formNewBill = screen.getByTestId('form-new-bill')
      const expenseTypeInput = screen.getByTestId('expense-type')
      const expenseNameInput = screen.getByTestId('expense-name')
      expect(formNewBill).toBeTruthy()
      expect(expenseTypeInput).toBeTruthy()
      expect(expenseNameInput).toBeTruthy()
    })
    test("Then user could add a file", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
      }))
      const newBill = new NewBill({
        document, onNavigate, store: mockedBills, localStorage: window.localStorage
      })
      
      const html = NewBillUI()
      document.body.innerHTML = html
      const testImageFile = new File(["hello"], "hello.png", { type: "image/png" });
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e))

      await waitFor(() => screen.getByTestId('file'))
      const formNewBillFileInput = screen.getByTestId('file')
      expect(formNewBillFileInput).toBeTruthy()
      formNewBillFileInput.addEventListener("change", handleChangeFile)
      userEvent.click(formNewBillFileInput)

      // Make sure test is clean
      expect(formNewBillFileInput.files.length).toBe(0);
      userEvent.upload(formNewBillFileInput, testImageFile);
      // Make sure the action was successful
      expect(formNewBillFileInput.files.length).toBe(1);
    })
    test("Then user could submit a new bill", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
      }))
      const newBill = new NewBill({
        document, onNavigate, store: mockedBills, localStorage: window.localStorage
      })
      const html = NewBillUI()
      document.body.innerHTML = html
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      
      await waitFor(() => screen.getByTestId('form-new-bill'))
      const formNewBill = screen.getByTestId('form-new-bill')
      // const datepicker = screen.getByTestId('datepicker')
      const submitBtn = screen.getByText('Envoyer')
      // datepicker.value = Date.now()
      expect(formNewBill).toBeTruthy()
      formNewBill.addEventListener("submit", handleSubmit)
      fireEvent.click(submitBtn)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})
