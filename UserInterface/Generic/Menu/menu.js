﻿
csapp.factory("menuFactory", [function () {

    var menu = [];

    //var getperm = function (perms) {

    //    if (!angular.isArray(perms) || perms.length === 0) return false;
    //    var permission = false;

    //    for (var i = 0; i < perms.length; i++) {
    //        if (angular.isUndefined(perms[i]) || perms[i] === null)
    //            continue;
    //        if (perms[i] === true) {
    //            permission = true;
    //            break;
    //        }
    //    }

    //    return permission;
    //};

    var getperm = function (childrens, arrayOfActivity, access) {

        var hasAccess = access;

        _.forEach(arrayOfActivity, function (activity) {
            _.forEach(childrens, function (child) {
                if (child.Activity === activity.activity) {
                    if (activity.subActivity === "")
                        hasAccess = hasAccess || child.HasAccess;
                    else {
                        hasAccess = hasAccess || getperm(child.Childrens, [{ activity: activity.subActivity, subActivity: "" }], hasAccess);
                    }
                }
            });
        });

        return hasAccess;
    };

    var setPermObj = function (permObj, root) {
        _.forEach(root.Childrens, function (activity) {
            switch (activity.Activity) {
                case "FileUploader":
                    permObj.fileUpload = activity;
                    break;
                case "Billing":
                    permObj.billing = activity;
                    break;
                case "Stakeholder":
                    permObj.stakeholder = activity;
                    break;
                case "Config":
                    permObj.config = activity;
                    break;
                case "Allocation":
                    permObj.allocation = activity;
                    break;
                case "Developer":
                    permObj.developer = activity;
                    break;
            }

        });
        console.log("permissionObj: ", permObj);
        return permObj;
    };

    var initMenu = function (permissions) {

        var root = permissions[0];
        var permObj = {};
        permObj = setPermObj(permObj, root);

        menu = [
            {
                Title: "File Upload",
                url: "#",
                icon: "fa-cloud-upload",
                display: permObj.fileUpload.HasAccess,
                childMenu: [
                    {
                        Title: "FileDetail",
                        url: "#/fileupload/filedetail",
                        display: getperm(permObj.fileUpload.Childrens, [{ activity: 'CreateFile', subActivity: "AddEdit" },
                                                                        { activity: 'CreateFile', subActivity: "Update" },
                                                                        { activity: 'CreateFile', subActivity: "View" }], false)

                    },
                    {
                        Title: "File Column",
                        url: "#/fileupload/filecolumn",
                        display: getperm(permObj.fileUpload.Childrens, [{ activity: 'CreateFile', subActivity: "AddEdit" },
                                                                        { activity: 'CreateFile', subActivity: "Update" },
                                                                        { activity: 'CreateFile', subActivity: "View" }], false)

                    },
                    {
                        Title: "File Mapping",
                        url: "#/fileupload/filemapping",
                        display: getperm(permObj.fileUpload.Childrens, [{ activity: 'CreateFile', subActivity: "AddEdit" },
                                                                        { activity: 'CreateFile', subActivity: "Update" },
                                                                        { activity: 'CreateFile', subActivity: "View" }], false)
                    },
                    {
                        Title: "Schedule Files",
                        url: "#/fileupload/filescheduler",
                        display: getperm(permObj.fileUpload.Childrens, [{ activity: "ScheduleFile", subActivity: "Schedule" }], false)
                    },
                    {
                        Title: "Check Status",
                        url: "#/fileupload/filestatus",
                        display: getperm(permObj.fileUpload.Childrens, [{ activity: "ScheduleFile", subActivity: "Status" }], false)

                    },
                    {
                        Title: "Data Download",
                        url: "#/fileupload/clientdatadownload",
                        display: getperm(permObj.fileUpload.Childrens, [{ activity: "CustomerData", subActivity: "View" }], false)
                    },
                    {
                        Title: "Customer Info",
                        url: "#/fileupload/customerinfo",
                        display: getperm(permObj.fileUpload.Childrens, [{ activity: "CustomerData", subActivity: "View" }], false)
                    },
                    {
                        Title: "Upload Pincode",
                        url: "#/fileupload/uploadpincode",
                        display: true
                    },
                    {
                        Title: "Upload Rcode",
                        url: "#/fileupload/uploadrcode",
                        display: getperm(permObj.fileUpload.Childrens, [{ activity: "UploadCustInfo", subActivity: "" }], false)
                    },
                    {
                        Title: "Correct Errors",
                        url: "#/fileupload/errorcorrection",
                        display: getperm(permObj.fileUpload.Childrens, [{ activity: "ErrorCorrection", subActivity: "Update" }], false)
                    },
                    {
                        Title: "Filter Data",
                        url: "#/fileupload/filterCondition",
                        display: true
                    }

                ]
            },
            {
                Title: "Stakeholder",
                url: "#",
                icon: "fa-users",
                display: permObj.stakeholder.HasAccess,
                childMenu: [
                    {
                        Title: "Add",
                        url: "#/stakeholder/add",
                        display: getperm(permObj.stakeholder.Childrens, [{ activity: "AddStakeholder", subActivity: "Create" },
                                                                         { activity: "AddHierarchy", subActivity: "Create" }], false)
                    },
                    {
                        Title: "View",
                        url: "#/stakeholder/view",
                        display: getperm(permObj.stakeholder.Childrens, [{ activity: "ViewStakeholder", subActivity: "View" },
                                                                         { activity: "ViewStakeholder", subActivity: "Approve" },
                                                                         { activity: "ViewHierarchy", subActivity: "View" },
                                                                         { activity: "ViewHierarchy", subActivity: "Approve" }], false)

                    }
                ]
            },
            {
                Title: "Allocation",
                url: "#",
                icon: "fa-briefcase",
                //display: getperm([permissions.Allocation.access]),
                childMenu: [
                    {
                        Title: "Policy",
                        url: "#/allocation/policy",
                        //display: getperm([(permissions.Allocation.childrens.DefinePolicy.childrens.View.access),
                        //(permissions.Allocation.childrens.DefinePolicy.childrens.Create.access),
                        //(permissions.Allocation.childrens.DefinePolicy.childrens.Update.access),
                        //(permissions.Allocation.childrens.DefinePolicy.childrens.Approve.access)])

                    },
                    {
                        Title: "Subpolicy",
                        url: "#/allocation/subpolicy",
                        //display: getperm([(permissions.Allocation.childrens.DefineSubpolicy.childrens.View.access),
                        //(permissions.Allocation.childrens.DefineSubpolicy.childrens.Create.access),
                        //(permissions.Allocation.childrens.DefineSubpolicy.childrens.Update.access)])//||
                        //(permissions.Allocation.childrens.DefineSubpolicy.childrens.Approve.access)
                    },
                    {
                        Title: "View/Approve",
                        url: "#/allocation/viewapprove",
                        //display: getperm([(permissions.Allocation.childrens.CheckAllocation.childrens.View.access),
                        //(permissions.Allocation.childrens.CheckAllocation.childrens.Update.access),
                        //(permissions.Allocation.childrens.CheckAllocation.childrens.Approve.access)])
                    }
                ]
            },
            {
                Title: "Billing",
                url: "#",
                icon: "fa-inr",
                //display: getperm([permissions.Billing.access]),
                childMenu: [
                    {
                        Title: "Policy",
                        url: "#/billing/policy",
                        //display: getperm([(permissions.Billing.childrens.DefinePolicy.childrens.View.access),
                        //(permissions.Billing.childrens.DefinePolicy.childrens.Create.access),
                        //(permissions.Billing.childrens.DefinePolicy.childrens.Update.access),
                        //(permissions.Billing.childrens.DefinePolicy.childrens.Approve.access)])

                    },
                    {
                        Title: "Subpolicy",
                        url: "#/billing/subpolicy",
                        //display: getperm([(permissions.Billing.childrens.DefineSubPolicy.childrens.View.access),
                        //(permissions.Billing.childrens.DefineSubPolicy.childrens.Create.access),
                        //(permissions.Billing.childrens.DefineSubPolicy.childrens.Update.access)])//||
                        ////(permissions.Billing.childrens.DefineSubPolicy.childrens.Approve.access),
                    },
                    {
                        Title: "Formula",
                        url: "#/billing/formula",
                        //display: getperm([(permissions.Billing.childrens.DefineFormula.childrens.View.access),
                        //(permissions.Billing.childrens.DefineFormula.childrens.Create.access),
                        //(permissions.Billing.childrens.DefineFormula.childrens.Update.access)])
                    },
                    {
                        Title: "Formula2",
                        url: "#/billing/formula2",
                        //display: getperm([(permissions.Billing.childrens.DefineFormula.childrens.View.access),
                        //(permissions.Billing.childrens.DefineFormula.childrens.Create.access),
                        //(permissions.Billing.childrens.DefineFormula.childrens.Update.access)])
                    },
                    {
                        Title: "Matrix",
                        url: "#/billing/matrix",
                        //display: getperm([(permissions.Billing.childrens.DefineMatrix.childrens.View.access),
                        //(permissions.Billing.childrens.DefineMatrix.childrens.Create.access),
                        //(permissions.Billing.childrens.DefineMatrix.childrens.Update.access)])
                    },
                    {
                        Title: "Manual Payment",
                        url: "#/fileupload/paymentchanges",
                        //display: getperm([(permissions.FileUpload.childrens.ModifyPayment.childrens.View.access),
                        //(permissions.FileUpload.childrens.ModifyPayment.childrens.Create.access),
                        //(permissions.FileUpload.childrens.ModifyPayment.childrens.Update.access),
                        //(permissions.FileUpload.childrens.ModifyPayment.childrens.Approve.access)])
                    },
                    {
                        Title: "Ready For Billing",
                        url: "#/billing/readybilling",
                        //display: getperm([permissions.Billing.childrens.ReadyForBilling.childrens.View.access]),
                    },
                    {
                        Title: "Execution Status",
                        url: "#/billing/status",
                        //display: getperm([permissions.Billing.childrens.ReadyForBilling.childrens.Approve.access]),
                    },
                    {
                        Title: "Bill Details",
                        url: "#/billing/summary",
                        //display: getperm([permissions.Billing.childrens.PayoutStatus.childrens.View.access]),
                    },
                    {
                        Title: "Pay Clearance Status",
                        url: "#/billing/billstatus",
                        //display: getperm([permissions.Billing.childrens.PayoutStatus.childrens.View.access]),
                    }
                ]
            },
            {
                Title: "Bill Extension",
                url: "#",
                icon: "fa-rupee",
                childMenu: [
                    {
                        Title: "AdHoc",
                        url: "#/billing/adhoc",
                        display: true //(permissions.Billing.childrens.AdhocPayout.childrens.Create.access) ||
                        //(permissions.Billing.childrens.AdhocPayout.childrens.Update.access),
                    },
                    {
                        Title: "AdHoc Bulk",
                        url: "#/billing/adhocbulk",
                        display: true //(permissions.Billing.childrens.AdhocPayout.childrens.View.access) ||
                        //(permissions.Billing.childrens.AdhocPayout.childrens.Create.access) ||
                        //(permissions.Billing.childrens.AdhocPayout.childrens.Update.access) ||
                        //(permissions.Billing.childrens.AdhocPayout.childrens.Approve.access),
                    },
                    {
                        Title: "Holding Policy",
                        url: "#/billing/holdingpolicy",
                        display: true
                    },
                    {
                        Title: "Manage Holding",
                        url: "#/billing/holdingactive",
                        display: true
                    }
                ]

            },

            {
                Title: "Config",
                url: "#",
                icon: "fa-cogs",
                //display: getperm([permissions.Config.access]),
                childMenu: [
                    //{
                    //    Title: "Add Hierarchy",
                    //    url: "#/generic/hierarchy/add",
                    //    display: ""
                    //},
                    {
                        Title: "Add/Edit/View Hierarchy",
                        url: "#/generic/hierarchy",
                        display: '',
                    },
                    {
                        Title: "Permissions",
                        url: "#/generic/permission",
                        //display: getperm([(permissions.Config.childrens.Permission.childrens.View.access),
                        //    (permissions.Config.childrens.Permission.childrens.Update.access)])
                    },
                    {
                        Title: "Products",
                        url: "#/generic/product",
                        //display: getperm([(permissions.Config.childrens.Products.childrens.View.access),
                        //         (permissions.Config.childrens.Products.childrens.Update.access),
                        //         (permissions.Config.childrens.Products.childrens.Approve.access)])
                    },
                    {
                        Title: "KeyValue",
                        url: "#/generic/keyvalue",
                        //display: getperm([(permissions.Config.childrens.KeyValue.childrens.View.access),
                        //         (permissions.Config.childrens.KeyValue.childrens.Update.access),
                        //         (permissions.Config.childrens.KeyValue.childrens.Approve.access)])
                    },
                    {
                        Title: "Pincode",
                        url: "#/generic/pincode",
                        //display: getperm([(permissions.Config.childrens.Pincode.childrens.View.access),
                        //         (permissions.Config.childrens.Pincode.childrens.Update.access),
                        //         (permissions.Config.childrens.Pincode.childrens.Create.access)])
                    },
                    {
                        Title: "Tax List",
                        url: "#/generic/taxlist",
                        //display: getperm([(permissions.Config.childrens.TaxList.childrens.View.access),
                        //         //(permissions.Config.childrens.TaxList.childrens.Update.access) ||
                        //         (permissions.Config.childrens.TaxList.childrens.Create.access)]),
                    },
                    {
                        Title: "Tax Master",
                        url: "#/generic/taxmaster",
                        //display: getperm([(permissions.Config.childrens.TaxMaster.childrens.View.access),
                        //         (permissions.Config.childrens.TaxMaster.childrens.Update.access),
                        //         (permissions.Config.childrens.TaxMaster.childrens.Create.access)]),
                    }
                ]
            },
            {
                Title: "Dev Tools",
                url: "#",
                icon: "fa-wrench",
                display: true,
                childMenu: [
                    {
                        Title: "System Explorer",
                        url: "#/developer/logdownload",
                        display: '',
                    },
                    {
                        Title: "Generate DB",
                        url: "#/developer/generatedb",
                        display: true,
                    },
                    {
                        Title: "DB Tables",
                        url: "#/developer/viewdbtables",
                        display: '',
                    },
                    {
                        Title: "Execute Query",
                        url: "#/developer/queryexecuter",
                        display: '',
                    }
                ]
            },
            {
                Title: "User",
                url: "#",
                icon: "fa-user",
                display: true,
                childMenu: [
                    {
                        Title: "Profile",
                        url: "#/generic/profile",
                        display: '',
                    },
                    {
                        Title: "Change Password",
                        url: "#/generic/changepassword",
                        display: true,
                    },
                    {
                        Title: "Logout",
                        url: "#/logout",
                        display: '',
                    }
                ]
            }
        ];
        createAuthorisedMenu(menu);
        return menu;
    };

    var createAuthorisedMenu = function (menus) {
        menu = [];
        _.forEach(menus, function (module) {
            var menuObj = {};
            if (module.display === true) {
                menuObj.Title = module.Title;
                menuObj.url = module.url;
                menuObj.icon = module.icon;
                menuObj.childMenu = [];
                _.forEach(module.childMenu, function (subMenu) {//push only authorised childMenus
                    if (subMenu.display === true)
                        menuObj.childMenu.push(angular.copy(subMenu));
                });

                menu.push(menuObj);
            }
        });
        console.log(menu);
        //return menu;
    };

    return {
        menu: menu,
        initMenu: initMenu,
    };

}]);

csapp.controller("menuController", ["$scope", "menuFactory", "rootDatalayer", "$csAuthFactory", "$csfactory", function ($scope, menuFactory, datalayer, $csAuthFactory, $csfactory) {

    (function () {
        $scope.$watch(function () {
            return $csAuthFactory.getUsername();
        }, function (newval) {
            if (!$csfactory.isNullOrEmptyString(newval)) {
                datalayer.getPermission($csAuthFactory.getUsername()).then(function (data) {
                    console.log("Permission: ", data);
                    //$scope.menus = menuFactory.initMenu(data);
                    console.log("menu: ", data);
                    $scope.menus = data;
                });
            }
        });
    })();

}]);
