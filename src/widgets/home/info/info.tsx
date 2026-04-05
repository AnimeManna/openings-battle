import classess from "./info.module.scss";
export const HomeInfo: React.FC = () => {
  const parts: { title: string; items: string[] }[] = [
    {
      title: "Первый этап",
      items: [
        "Первый этап был закончен, спасибо всем кто принял участие!",
        "Вы можете и дальше голосовать, на второй этап это никак не повлияет, но для составления личного топа, можете пользоваться сервисом",
      ],
    },
    {
      title: "Второй этап",
      items: [
        "Первые раунды будут проходить в формате 'Round robin'",
        "Из 4 участников раунда, нужно выбрать 2",
        "В день будет открываться по 4 раунда, в сумме 16 опенингов в день.",
        "Если вы пропустили раунд, не страшно, они активны, пока активен весь текущий 'Стейдж'",
        "Следующие раунды будут в формате 1х1 их количество в день будет разным, так что следите за обновлениями!",
      ],
    },
  ];

  return (
    <div className={classess.container}>
      <p className={classess.title}>Добро пожаловать!</p>
      <p className={classess.caption}>
        Вы один из немногих кто был выбран для участия в турнире опенингов
        приуроченных к дню рождения. Я кратко изложу вам всё что вам нужно
        знать.
      </p>
      {parts.map((part) => (
        <div className={classess.part} key={part.title}>
          <p className={classess["part__title"]}>{part.title}</p>
          <ul className={classess.list}>
            {part.items.map((item) => (
              <li className={classess.item} key={item}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
      Для связи и обновлений:
      <a
        target="_blank"
        href="https://discord.gg/HjtwV4ch"
        className={classess.link}
      >
        https://discord.gg/HjtwV4ch
      </a>
    </div>
  );
};
