// Copyright © 2020 The Things Network Foundation, The Things Industries B.V.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

describe('End device create', () => {
  const user = {
    ids: { user_id: 'create-device-test-user' },
    primary_email_address: 'create-device-test-user@example.com',
    password: 'ABCDefg123!',
    password_confirm: 'ABCDefg123!',
  }

  before(() => {
    cy.dropAndSeedDatabase()
    cy.createUser(user)
  })

  describe('OTAA', () => {
    const application = {
      id: 'otaa-test-application',
    }

    before(() => {
      cy.loginConsole({ user_id: user.ids.user_id, password: user.password })
      cy.createApplication(user.ids.user_id, {
        ids: { application_id: application.id },
      })
    })

    it('succeeds creating The Things Uno', () => {
      cy.visit(`${Cypress.config('consoleRootPath')}/applications/${application.id}/devices/add`)

      const device = {
        id: 'otaa-test-uno',
        app_eui: '1122334455667788',
        dev_eui: '8877665544332211',
        name: 'Test OTAA The Things Uno',
        description: 'The Things Uno test device',
        lorawan_version: 'MAC V1.0.2',
        frequency_plan_id: '863-870 MHz',
        lorawan_phy_version: 'PHY V1.0.2 REV B',
        app_key: 'AB24705E0DC6EC79FFF42FC3D05083E9',
      }

      // Configuration step.
      cy.findByLabelText('Over the air activation (OTAA)').click()
      cy.findByLabelText('LoRaWAN version').type(`${device.lorawan_version}{enter}`, {
        force: true,
      })
      cy.findByRole('button', { name: /Start/ }).click()

      // Basic settings step.
      cy.findByLabelText('End device ID').type(device.id)
      cy.findByLabelText('AppEUI').type(device.app_eui)
      cy.findByLabelText('DevEUI').type(device.dev_eui)
      cy.findByLabelText('End device name').type(device.name)
      cy.findByLabelText('End device description').type(device.description)
      cy.findByRole('button', { name: /Network layer settings/ }).click()

      // Network layer settings step.
      cy.findByLabelText('Frequency plan').type(`${device.frequency_plan_id}{enter}`, {
        force: true,
      })
      cy.findByLabelText('Regional Parameters version').type(
        `${device.lorawan_phy_version}{enter}`,
        {
          force: true,
        },
      )
      cy.findByRole('button', { name: /Join settings/ }).click()

      // Join settings step.
      cy.findByLabelText('AppKey').type(device.app_key)
      cy.findByRole('button', { name: 'Add end device' }).click()

      cy.location('pathname').should(
        'eq',
        `${Cypress.config('consoleRootPath')}/applications/${application.id}/devices/${device.id}`,
      )
      cy.findByTestId('full-error-view').should('not.exist')
    })
  })

  describe('ABP', () => {
    const application = {
      id: 'abp-test-application',
    }

    before(() => {
      cy.loginConsole({ user_id: user.ids.user_id, password: user.password })
      cy.createApplication(user.ids.user_id, {
        ids: {
          application_id: application.id,
        },
      })
    })

    it('succeeds creating The Things Uno', () => {
      cy.visit(`${Cypress.config('consoleRootPath')}/applications/${application.id}/devices/add`)

      const device = {
        id: 'abp-test-uno',
        dev_eui: '1122334455667788',
        dev_addr: '11223344',
        name: 'Test ABP The Things Uno',
        description: 'The Things Uno test device',
        lorawan_version: 'MAC V1.0.2',
        frequency_plan_id: '863-870 MHz',
        lorawan_phy_version: 'PHY V1.0.2 REV B',
        nwk_s_key: 'C133938045EE798721104CB92D937E74',
        rx2_data_rate_index: 3,
        frequencies: [
          '868100000',
          '868300000',
          '868500000',
          '867100000',
          '867300000',
          '867500000',
          '867700000',
          '867900000',
        ],
        app_s_key: '855B923AE24EA140C7AED41D18859B48',
      }

      // Configuration step.
      cy.findByLabelText('Activation by personalization (ABP)').click()
      cy.findByLabelText('LoRaWAN version').type(`${device.lorawan_version}{enter}`, {
        force: true,
      })
      cy.findByRole('button', { name: /Start/ }).click()

      // Basic settings step.
      cy.findByLabelText('End device ID').type(device.id)
      cy.findByLabelText('DevEUI').type(device.dev_eui)
      cy.findByLabelText('End device name').type(device.name)
      cy.findByLabelText('End device description').type(device.description)
      cy.findByRole('button', { name: /Network layer settings/ }).click()

      // Network layer settings step.
      cy.findByLabelText('Frequency plan').type(`${device.frequency_plan_id}{enter}`, {
        force: true,
      })
      cy.findByLabelText('Regional Parameters version').type(
        `${device.lorawan_phy_version}{enter}`,
        {
          force: true,
        },
      )
      cy.findByLabelTest('Supports class B').check()
      cy.findByLabelText('Device address').type(device.dev_addr)
      cy.findByLabelText('NwkSKey').type(device.nwk_s_key)
      cy.findByRole('heading', { name: /Advanced settings/ }).click()
      cy.findByLabelText('RX2 Data Rate Index').type(device.rx2_data_rate_index)
      cy.findByRole('button', { name: /Add Frequency/ }).as('addFactoryPresetFreqBtn')
      for (const idx in device.frequencies) {
        cy.get('@addFactoryPresetFreqBtn').click()
        cy.get(`[name="mac_settings.factory_preset_frequencies[${idx}].value"]`).type(
          device.frequencies[idx],
        )
      }
      cy.findByRole('button', { name: /Application layer settings/ }).click()

      // Application layer settings step.
      cy.findByLabelText('AppSKey').type(device.app_s_key)
      cy.findByRole('button', { name: 'Add end device' }).click()

      cy.location('pathname').should(
        'eq',
        `${Cypress.config('consoleRootPath')}/applications/${application.id}/devices/${device.id}`,
      )
      cy.findByTestId('full-error-view').should('not.exist')
    })
  })
})
