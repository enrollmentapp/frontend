import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatStepper } from '@angular/material/stepper';
import { ApiHttpService } from 'src/app/core/services/api-http.service';
import { FormDataService } from 'src/app/core/services/form-data.service';
import { AdminService } from 'src/app/core/services/admin.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
  animations: [
    trigger('myAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          '400ms',
          style({
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(
          '400ms',
          style({
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class EmployeeFormComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;

  // This is used to hide the employee form after submission, will
  // show the loading page instead
  isLoading = false;
  // If form is saved or continued this will be populated in order to show
  requestNumber: number;
  form: FormGroup;
  submitResponse: object; // Will hold the response if submission is successful
  hasSubmitted: boolean;
  currentIndex: number;
  errorStateMatcher = new InstantErrorStateMatcher();

  // Render booleans for the Access Information Step
  renderIBMForm: boolean;
  renderUnixEnvAccess: boolean;
  renderSecurIdAccess: boolean;

  divCheifList: Array<any>;
  deptHeadList: Array<any>;
  appCoordList: Array<any>;
  deptInfoList: Array<any>;

  constructor(
    private formDataService: FormDataService,
    private apiHttpService: ApiHttpService,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    // Setting inital step, 0
    this.currentIndex = 0;
    /**
     * If there is a form in the form data service, then it most likely
     * means that the user is coming from the homepage. Meaning that they
     * are continuing a form.
     */

     this.getDivChiefList();
     this.getDeptHead();
     this.getAppCoord();
     this.getDeptInfo();
    
      // Starting a new form
      this.form = this.createDefaultFormGroup();
      // To show the form instead of the submit page
      this.hasSubmitted = false;
    
  }
  /**
   * Takes care of creating a form group.
   * @return The form group that is used in the employee form.
   */
  createDefaultFormGroup(): FormGroup {
    const formGroup = new FormGroup({
      personalInformation: new FormGroup({
        lastName: new FormControl(null, [
          Validators.required,
          Validators.pattern('[a-z A-Z]*'),
        ]),
        firstName: new FormControl(null, [
          Validators.required,
          Validators.pattern('[a-z A-Z]*'),
        ]),
        isEmployee: new FormControl(true),
        middleInitial: new FormControl(null, Validators.pattern('[a-z A-Z]*')),
        emailAddress: new FormControl(null, [
          Validators.required,
          Validators.email,
        ]),
        countyDepartmentName: new FormControl(null, [
          Validators.required,
          Validators.pattern('[a-z A-Z]*'),
        ]),
        countyDepartmentNumber: new FormControl(null, [
          Validators.required,
          Validators.pattern('[0-9]*'),
        ]),
        phoneNumber: new FormControl(null, [
          Validators.required,
          Validators.pattern('[0-9]{10}'),
        ]),
        workPhoneNumber: new FormControl(null, [
          Validators.required,
          Validators.pattern('[0-9]{10}'),
        ]),
        employeeNumber: new FormControl(null),
        contractorName: new FormControl(null, [
          Validators.required,
          Validators.pattern('[a-z A-Z]*'),
        ]),
        workOrderNumberInput: new FormControl(null, [
          Validators.required,
          Validators.pattern('[0-9]*'),
        ]),
        expirationDate: new FormControl(null),
      }),
      addressInformation: new FormGroup({
        address: new FormControl(null, Validators.required),
        city: new FormControl(null, [
          Validators.required,
          Validators.pattern('[a-z A-Z]*'),
        ]),
        state: new FormControl(null, [
          Validators.required,
          Validators.pattern('[a-z A-Z]*'),
        ]),
        zipCode: new FormControl(null, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(7),
          Validators.pattern('[0-9]*'),
        ]),
      }),
      internetAccess: new FormGroup({
        countyWidePolicyA: new FormControl(false),
        countyWidePolicyB: new FormControl(false),
        allWebmail: new FormControl(false),
        streamMedia: new FormControl(false),
        justification: new FormControl(null),
      }),
      accessInformation: new FormGroup({
        // IBM Data Center Access
        ibmLogonId: new FormControl(null, []),
        majorGroupCode: new FormControl(null, [
          Validators.pattern('[0-9]{2}'),
          Validators.minLength(2),
          Validators.maxLength(2),
        ]),
        lsoGroupCode: new FormControl(null, [
          Validators.pattern('[0-9]{2}'),
          Validators.minLength(2),
          Validators.maxLength(2),
        ]),
        securityAuthorization: new FormControl(null),
        // Unix Environment Access
        unixLogonId: new FormControl(null),
        application: new FormControl(null),
        accessGroup: new FormControl(null),
        // SecurID Remote Access
        billingAccountNumber: new FormControl(null),
        accessType: new FormControl(null),
      }),
      additionalInformation: new FormGroup({
        laCountyGovAccess: new FormControl(false),
        lacMobileWifiAccess: new FormControl(false),
        o365Email: new FormControl(false),
      }),
      managerInformation: new FormGroup({
        managerFirstName: new FormControl(null),
        managerLastName: new FormControl(null),
        managerEmail: new FormControl(null),
        managerPhone: new FormControl(null),
      }),
      signatures: new FormGroup({
        applicationCoordinatorName: new FormControl(
          null
        ),
        applicationCoordinatorPhone: new FormControl(
          null
        ),
        applicationCoordinatorEmail: new FormControl(
          null
        ),

        divChiefManagerName: new FormControl(
          null
        ),
        divChiefManagerPhone: new FormControl(
          null
        ),
        divChiefManagerEmail: new FormControl(
          null
        ),

        deptInfoSecurityOfficerName: new FormControl(
          null
        ),
        deptInfoSecurityOfficerPhone: new FormControl(
          null
        ),
        deptInfoSecurityOfficerEmail: new FormControl(
          null
        ),
        departmentHeadName: new FormControl(
          null
        ),
        departmentHeadPhone: new FormControl(
          null
        ),
        departmentHeadEmail: new FormControl(
          null
        ),
      }),
    });
    return formGroup;
  }

  // TODO: Add manager information
  /**
   * Creates a form group that is prefilled with data from the formDataService. When the user
   * continues a form, the formDataService will hold the existing form.
   * @returns A form group that is prefilled with data from an existing form on the server.
   */
  createContinuedFormGroup(): FormGroup {
    const formGroup = new FormGroup({
      personalInformation: new FormGroup({
        lastName: new FormControl(this.formDataService.formData.lastName, [
          Validators.required,
          Validators.pattern('[a-z A-Z]*'),
        ]),
        firstName: new FormControl(this.formDataService.formData.firstName, [
          Validators.required,
          Validators.pattern('[a-z A-Z]*'),
        ]),
        isEmployee: new FormControl(
          this.formDataService.formData.isEmployee
        ),
        middleInitial: new FormControl(
          this.formDataService.formData.middleInitial,
          Validators.pattern('[a-z A-Z]*')
        ),
        emailAddress: new FormControl(
          this.formDataService.formData.emailAddress,
          [Validators.required, Validators.email]
        ),
        countyDepartmentName: new FormControl(this.formDataService.formData.countyDepartmentName, [
          Validators.pattern('[a-z A-Z]*'),
        ]),
        contractorName: new FormControl(this.formDataService.formData.contractorName, [
          Validators.pattern('[a-z A-Z]*'),
        ]),
        countyDepartmentNumber: new FormControl(this.formDataService.formData.countyDepartmentNumber, [
          Validators.pattern('[0-9]*'),
        ]),
        phoneNumber: new FormControl(
          this.formDataService.formData.phoneNumber,
          [ Validators.pattern('[0-9]{10}')]
        ),
        workPhoneNumber: new FormControl(
          this.formDataService.formData.workPhoneNumber,
          [ Validators.pattern('[0-9]{10}')]
        ),
        workOrderNumberInput: new FormControl(
          this.formDataService.formData.workOrderNumberInput,
          [ Validators.pattern('[0-9]*')]
        ),
        employeeNumber: new FormControl(
          this.formDataService.formData.employeeNumber,
          []
        ),
        expirationDate: new FormControl(
          this.formDataService.formData.expirationDate,
          []
        ),
      }),
      addressInformation: new FormGroup({
        address: new FormControl(
          this.formDataService.formData.address,
          Validators.required
        ),
        city: new FormControl(this.formDataService.formData.city, [
          Validators.required,
          Validators.pattern('[a-z A-Z]*'),
        ]),
        state: new FormControl(this.formDataService.formData.state, [
          Validators.required,
          Validators.pattern('[a-z A-Z]*'),
        ]),
        zipCode: new FormControl(this.formDataService.formData.zipCode, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(7),
          Validators.pattern('[0-9]*'),
        ]),
      }),
      internetAccess: new FormGroup({
        countyWidePolicyA: new FormControl(
          this.formDataService.formData.countyWidePolicyA
        ),
        countyWidePolicyB: new FormControl(
          this.formDataService.formData.countyWidePolicyB
        ),
        allWebmail: new FormControl(
          this.formDataService.formData.allWebmail
        ),
        streamingMedia: new FormControl(
          this.formDataService.formData.streamingMedia
        ),
        justification: new FormControl(
          this.formDataService.formData.justification
        ),
      }),
      accessInformation: new FormGroup({
        // IBM Data Center Access
        renderIBMForm: new FormControl(),
        ibmLogonId: new FormControl(this.formDataService.formData.ibmLogonId),
        majorGroupCode: new FormControl(
          this.formDataService.formData.majorGroupCode
        ),
        lsoGroupCode: new FormControl(
          this.formDataService.formData.lsoGroupCode
        ),
        securityAuthorization: new FormControl(
          this.formDataService.formData.securityAuthorization
        ),
        // Unix Environment Access
        renderUnixEnvAccess: new FormControl(),
        unixLogonId: new FormControl(this.formDataService.formData.unixLogOnId),
        application: new FormControl(
          this.formDataService.formData.application
        ),
        accessGroup: new FormControl(
          this.formDataService.formData.accessGroup
        ),
        

        // SecurID Remote Access
        renderSecurIdAccess: new FormControl(),
        billingAccountNumber: new FormControl(
          this.formDataService.formData.billingAccountNumber
        ),
        accessType: new FormControl(null), // Not yet implemented on backend
      }),
      additionalInformation: new FormGroup({
        laCountyGovAccess: new FormControl(
          this.formDataService.formData.laCountyGovAccess
        ),
        lacMobileWifiAccess: new FormControl(
          this.formDataService.formData.lacMobileWifiAccess
        ),
        o360Email: new FormControl(
          this.formDataService.formData.o360Email
        ),
      }),
      // TODO: Retrieve these values from formData
      managerInformation: new FormGroup({
        managerFirstName: new FormControl(
          this.formDataService.formData.managerFirstName
        ),
        managerLastName: new FormControl(
          this.formDataService.formData.managerLastName
        ),
        managerEmail: new FormControl(
          this.formDataService.formData.managerEmail
        ),
        managerPhone: new FormControl(
          this.formDataService.formData.managerPhone
        ),
      }),
      signatures: new FormGroup({
        applicationCoordinatorName: new FormControl(
          this.formDataService.formData.applicationCoordinatorName
        ),
        applicationCoordinatorPhone: new FormControl(
          this.formDataService.formData.applicationCoordinatorPhone
        ),
        applicationCoordinatorEmail: new FormControl(
          this.formDataService.formData.applicationCoordinatorEmail
        ),

        divChiefManagerName: new FormControl(
          this.formDataService.formData.divChiefManagerName
        ),
        divChiefManagerPhone: new FormControl(
          this.formDataService.formData.divChiefManagerPhone
        ),
        divChiefManagerEmail: new FormControl(
          this.formDataService.formData.divChiefManagerEmail
        ),

        deptInfoSecurityOfficerName: new FormControl(
          this.formDataService.formData.deptInfoSecurityOfficerName
        ),
        deptInfoSecurityOfficerPhone: new FormControl(
          this.formDataService.formData.deptInfoSecurityOfficerPhone
        ),
        deptInfoSecurityOfficerEmail: new FormControl(
          this.formDataService.formData.deptInfoSecurityOfficerEmail
        ),
        departmentHeadName: new FormControl(
          this.formDataService.formData.departmentHeadName
        ),
        departmentHeadPhone: new FormControl(
          this.formDataService.formData.departmentHeadPhone
        ),
        departmentHeadEmail: new FormControl(
          this.formDataService.formData.departmentHeadEmail
        ),
      }),
    
    });
    return formGroup;
  }

  setSelectedValue(type: string, id: number): void {
    if (type == 'divisionChief') {
      if (id == null) {
        this.form.get('signatures.divChiefManagerPhone').patchValue(null);
        this.form.get('signatures.divChiefManagerEmail').patchValue(null);
      } else {
        this.adminService.getDivChief(id).subscribe((res) => {
          this.form
            .get('signatures.divChiefManagerPhone')
            .patchValue(res.phone);
          this.form
            .get('signatures.divChiefManagerEmail')
            .patchValue(res.email);
        });
      }
    } else if (type == 'departmentHead') {
      if (id == null) {
        this.form.get('signatures.departmentHeadPhone').patchValue(null);
        this.form.get('signatures.departmentHeadEmail').patchValue(null);
      } else {
        this.adminService.getDeptHead(id).subscribe((res) => {
          this.form
            .get('signatures.departmentHeadPhone')
            .patchValue(res.phone);
          this.form
            .get('signatures.departmentHeadEmail')
            .patchValue(res.email);
        });
      }
    } else if (type == 'appCoord') {
      if (id == null) {
        this.form
          .get('signatures.applicationCoordinatorPhone')
          .patchValue(null);
        this.form
          .get('signatures.applicationCoordinatorEmail')
          .patchValue(null);
      } else {
        this.adminService.getAppCoord(id).subscribe((res) => {
          this.form
            .get('signatures.applicationCoordinatorPhone')
            .patchValue(res.phone);
          this.form
            .get('signatures.applicationCoordinatorEmail')
            .patchValue(res.email);
        });
      }
    } else {
      if (id == null) {
        this.form
          .get('signatures.deptInfoSecurityOfficerPhone')
          .patchValue(null);
        this.form
          .get('signatures.deptInfoSecurityOfficerEmail')
          .patchValue(null);
      } else {
        this.adminService.getDeptInfoSec(id).subscribe((res) => {
          this.form
            .get('signatures.deptInfoSecurityOfficerPhone')
            .patchValue(res.phone);
          this.form
            .get('signatures.deptInfoSecurityOfficerEmail')
            .patchValue(res.email);
        });
      }
    }
  }
  //get list for all approver types
  getDivChiefList() {
    this.adminService.getAllDivChief().subscribe((res) => {
      this.divCheifList = res;
    });
  }

  getDeptHead() {
    this.adminService.getAllDeptHead().subscribe((res) => {
      this.deptHeadList = res;
    });
  }

  getAppCoord() {
    this.adminService.getAllAppCoord().subscribe((res) => {
      this.appCoordList = res;
    });
  }

  getDeptInfo() {
    this.adminService.getAllDeptInfoSec().subscribe((res) => {
      this.deptInfoList = res;
    });
  }


  /*This functions is passed down to submit step
   *and it will change the index of the stepper*/
  setIndex = (newIndex: number): void => {
    this.myStepper.selectedIndex = newIndex;
  };

  // This function is passed down to submit step
  // Will update variable to rerender and hold response object
  setSubmitResponse = (response: object): void => {
    // Arrow function binds this
    this.hasSubmitted = true;
    this.submitResponse = response;
  };

  setIsLoading = (value: boolean): void => {
    this.isLoading = value;
  };

  // This function is responsible for saving the form
  save = (): void => {
    console.log('current form data', this.formDataService.formData);
    // A form is already in formData Service
    if (this.formDataService.formData != undefined) {
      console.log('from formData', this.formDataService.formData);
      this.apiHttpService
        .saveForm(
          this.formDataService.formData.requestNumber,
          false,
          this.form.value
        )
        .subscribe((res) => {
          console.log(res);
          // Set the formData to the response
          this.formDataService.formData = res;
        });
    } else {
      // Create a form and set to service
      this.apiHttpService.createForm(this.form.value, true).subscribe((res) => {
        console.log(res);
        this.formDataService.formData = res;

        // Set request number so it can display on page
        this.requestNumber = this.formDataService.formData.requestNumber;
      });
    }
  };

  // A testing function to log the form
  printForm(): void {
    console.log(this.form);
  }

  /**
   * @description This function is used by the buttons in access information step
   *
   * @param formName The form boolean that is going to be toggled.
   * Possible opitons: Ibm Access Infromation('ibm'), Unix Environment Access('unix'), SecurID Remote Access('securid')
   */
  toggleFormRender = (formName: string): void => {
    switch (formName) {
      case 'ibm':
        this.renderIBMForm = !this.renderIBMForm;
        break;
      case 'unix':
        this.renderUnixEnvAccess = !this.renderUnixEnvAccess;
        break;
      case 'securid':
        this.renderSecurIdAccess = !this.renderSecurIdAccess;
        break;
    }
  };
}

// changes the ErrorStateMatcher to include dirty
// removes the error message and red boxes after clicking next
class InstantErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return control && control.invalid && (control.dirty || control.touched);
  }
}
