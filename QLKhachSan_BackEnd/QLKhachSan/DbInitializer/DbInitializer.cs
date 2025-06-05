using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using QLKhachSan.Data;
using QLKhachSan.Models;
using QLKhachSan.Utility;


namespace QLKhachSan.DbInitializer
{
    public class DbInitializer
    {
        private readonly UserManager<Person> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _db;
        public DbInitializer(UserManager<Person> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext db)
        {
            _db = db;
            _userManager = userManager;
            _roleManager = roleManager;
        }
        public void Initialize()
        {
            try
            {
                if (_db.Database.GetPendingMigrations().Count() > 0)
                {
                    _db.Database.Migrate();
                }
            }
            catch (Exception ex)
            {

            }

            if (!_roleManager.RoleExistsAsync(SD.Role_Customer).GetAwaiter().GetResult()) //neu chua ton tai user admin thi tao
            {
                _roleManager.CreateAsync(new IdentityRole(SD.Role_Customer)).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(SD.Role_Employee)).GetAwaiter().GetResult();
                _roleManager.CreateAsync(new IdentityRole(SD.Role_Admin)).GetAwaiter().GetResult();

                _userManager.CreateAsync(new Person
                {
                    UserName = "admin@gmail.com",
                    Email = "admin@gmail.com",
                    FirstMidName = "Dam Linh",
                    LastName = "Lung",
                    Address = "To Xuyen",
                    CCCD = "123456789",

                },
                "@Kien123").GetAwaiter().GetResult(); // @Kien100903 mat khau

                Person user = _db.Persons.FirstOrDefault(u => u.Email == "admin@gmail.com");
                _userManager.AddToRoleAsync(user, SD.Role_Admin).GetAwaiter().GetResult();
            }
            return;
        }
    }

}
